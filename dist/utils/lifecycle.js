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
exports.getPm2Instance = exports.createOrganConfigFile = exports.getOrganConfig = void 0;
const models_1 = require("../models");
const constants_1 = require("./constants");
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const pm2 = require("pm2");
const functions_1 = require("./functions");
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
            yield (0, functions_1.waitModelReady)();
            const file = new spinal_core_connectorjs_1.File(`${fileName}.conf`.toLowerCase(), organInfo.model, undefined);
            directory.push(file);
            return resolve(organInfo.model);
        }));
    });
}
exports.createOrganConfigFile = createOrganConfigFile;
function getPm2Instance(name) {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err)
                return resolve(undefined);
            pm2.list((err, apps) => {
                if (err) {
                    return resolve(undefined);
                }
                const instance = apps.find(app => app.name === name);
                resolve(instance);
            });
        });
    });
}
exports.getPm2Instance = getPm2Instance;
function loadConfigModel(element) {
    return new Promise((resolve) => {
        element.load(organ => resolve(organ));
    });
}
function getFileInfoByPath(filePath) {
    const pathParts = filePath.split("/");
    const fileName = pathParts.pop() || "";
    const folderPath = pathParts.join("/");
    return { folderPath, fileName };
}
//# sourceMappingURL=lifecycle.js.map