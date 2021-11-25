"use strict";
/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
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
exports.SpinalConnectorService = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const constants_1 = require("../utils/constants");
const functions_1 = require("../utils/functions");
const models_1 = require("../models");
const pm2 = require("pm2");
/**
 * This class is a service of spinalcom connector it allows to manage a connector
 * @param  {string} connectorName - connector name
 * @param  {string} connectorType? - connector type
 * @param  {string} path? - connector path
 */
class SpinalConnectorService {
    constructor(name, type, path) {
        this.name = name;
        this.type = type || constants_1.DEFAULT_ORGAN_TYPE;
        this.path = path || `${constants_1.DEFAULT_PATH}/${this.type}`;
    }
    /**
     * This methods creates if not exists a connector config file.
     * @param  {any} spinalConnection
     * @param  {spinal.Model} element
     * @returns Promise
     */
    createOrganConfigFile(spinalConnection, element) {
        return new Promise((resolve) => {
            spinalConnection.load_or_make_dir(`${this.path}`, (directory) => {
                for (let index = 0; index < directory.length; index++) {
                    const element = directory[index];
                    const elementName = element.name.get();
                    if (elementName.toLowerCase() === `${this.name}.conf`.toLowerCase()) {
                        return element.load((organ) => __awaiter(this, void 0, void 0, function* () {
                            resolve({ alreadyExist: true, node: organ, instancePm2: yield this.getPm2Instance() });
                        }));
                    }
                }
                const model = new models_1.SpinalConnector(this.name, this.type, element);
                functions_1.waitModelReady().then(() => __awaiter(this, void 0, void 0, function* () {
                    const file = new spinal_core_connectorjs_type_1.File(`${name}.conf`.toLowerCase(), model, undefined);
                    directory.push(file);
                    return resolve({ alreadyExist: false, node: model, instancePm2: yield this.getPm2Instance() });
                }));
            });
        });
    }
    getPm2Instance() {
        return new Promise((resolve, reject) => {
            pm2.list((err, apps) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                const instance = apps.find(app => app.name === this.name);
                resolve(instance);
            });
        });
    }
}
exports.SpinalConnectorService = SpinalConnectorService;
//# sourceMappingURL=SpinalConnectorService.js.map