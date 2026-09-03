"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._compareDeviceListeners = exports.getDeviceListener = exports.findDevices = exports.getOrganDeviceNode = exports.createOrganConfigFile = exports.getOrganConfig = void 0;
const models_1 = require("../models");
const constants_1 = require("./constants");
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
// import * as pm2 from "pm2";
function getOrganConfig(spinalConnection, filePath) {
    return new Promise((resolve) => {
        const { folderPath, fileName } = getFileInfoByPath(filePath);
        spinalConnection.load_or_make_dir(`${folderPath}`, (directory) => __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < directory.length; index++) {
                const element = directory[index];
                const elementName = element.name.get().toLowerCase();
                if (elementName === fileName.toLowerCase() || elementName === `${fileName}.conf`.toLowerCase()) {
                    const organ = yield loadConfigModel(element);
                    return resolve(organ);
                }
            }
            resolve(null);
        }));
    });
}
exports.getOrganConfig = getOrganConfig;
function createOrganConfigFile(spinalConnection, organInfo) {
    return new Promise((resolve, reject) => {
        if (!organInfo.name)
            return reject(new Error("Organ name is required"));
        if (!organInfo.type)
            organInfo.type = constants_1.DEFAULT_ORGAN_TYPE;
        if (!organInfo.path)
            organInfo.path = `${constants_1.DEFAULT_PATH}/${organInfo.name}`;
        if (!organInfo.model)
            organInfo.model = new models_1.SpinalOrganModel(organInfo.name, organInfo.type);
        let { folderPath, fileName } = getFileInfoByPath(organInfo.path);
        if (fileName.toLowerCase().endsWith(".conf"))
            fileName = fileName.replace(/\.conf$/i, ""); // Remove .conf extension if present
        spinalConnection.load_or_make_dir(`${folderPath}`, (directory) => __awaiter(this, void 0, void 0, function* () {
            const file = new spinal_core_connectorjs_1.File(`${fileName}.conf`.toLowerCase(), organInfo.model, undefined);
            directory.push(file);
            return resolve(organInfo.model);
        }));
    });
}
exports.createOrganConfigFile = createOrganConfigFile;
function getOrganDeviceNode(organ) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodeRefs = yield organ.getAllReferences();
        const promises = Object.keys(nodeRefs).map((contextId) => __awaiter(this, void 0, void 0, function* () {
            const node = nodeRefs[contextId];
            const devices = yield findDevices(node);
            return [contextId, devices];
        }));
        const results = yield Promise.all(promises);
        return Object.fromEntries(results);
    });
}
exports.getOrganDeviceNode = getOrganDeviceNode;
function findDevices(parentNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const relations = [spinal_model_bmsnetwork_1.SpinalBmsNetwork.relationName, spinal_model_bmsnetwork_1.SpinalBmsDevice.relationName];
        const queue = [parentNode];
        const devices = [];
        while (queue.length > 0) {
            const node = queue.shift();
            const children = yield node.getChildren(relations);
            for (const child of children) {
                if (child.getType().get() === spinal_model_bmsnetwork_1.SpinalBmsDevice.nodeTypeName) {
                    devices.push(child);
                    continue;
                }
                queue.push(child);
            }
        }
        return devices;
    });
}
exports.findDevices = findDevices;
function getDeviceListener(devices) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = {};
        const promises = devices.map((device) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const listener = yield ((_a = device.info.listener) === null || _a === void 0 ? void 0 : _a.load());
            return listener;
        }));
        return Promise.all(promises).then((listeners) => listeners.filter((listener) => listener !== undefined));
    });
}
exports.getDeviceListener = getDeviceListener;
function _compareDeviceListeners(listenerModels, deviceListeners) {
    return __awaiter(this, void 0, void 0, function* () {
        if (listenerModels.length !== deviceListeners.length) {
            return { valid: false, message: "Listener models count does not match the number of device listeners" };
        }
        const listenersObj = listenerModels.reduce((acc, listener) => {
            const key = listener._server_id;
            acc[key] = listener;
            return acc;
        }, {});
        for (const listener of deviceListeners) {
            const key = listener._server_id;
            if (!listenersObj[key]) {
                return { valid: false, message: `Device listener with server ID ${key} does not have a corresponding listener model` };
            }
        }
        return { valid: true };
    });
}
exports._compareDeviceListeners = _compareDeviceListeners;
// export function getPm2Instance(name: string): Promise<pm2.ProcessDescription | undefined> {
//     return new Promise((resolve, reject) => {
//         pm2.connect((err) => {
//             if (err) return resolve(undefined);
//             pm2.list((err, apps) => {
//                 if (err) {
//                     return resolve(undefined);
//                 }
//                 const instance = apps.find(app => app.name === name);
//                 resolve(instance);
//             });
//         });
//     });
// }
function loadConfigModel(element) {
    return new Promise((resolve) => {
        element.load((organ) => resolve(organ));
    });
}
function getFileInfoByPath(filePath) {
    const pathParts = filePath.split("/");
    const fileName = pathParts.pop() || "";
    const folderPath = pathParts.join("/");
    return { folderPath, fileName };
}
//# sourceMappingURL=lifecycle.js.map