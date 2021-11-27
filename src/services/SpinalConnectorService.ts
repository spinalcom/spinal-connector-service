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

import { FileSystem, File } from "spinal-core-connectorjs_type";
import { DEFAULT_ORGAN_TYPE, DEFAULT_PATH } from "../utils/constants";
import { waitModelReady } from '../utils/functions';
import { IConnectorInfo, IConnectorCreation } from "../interfaces";
import { SpinalConnector } from '../models'
import * as pm2 from 'pm2';

/**
 * This class is a service of spinalcom connector it allows to manage a connector 
 * @param  {string} connectorName - connector name
 * @param  {string} connectorType? - connector type
 * @param  {string} path? - connector path
 */
export class SpinalConnectorService {
    private name: string;
    private type: string;
    private path: string;


    constructor(name: string, type?: string, path?: string) {
        this.name = name;
        this.type = type || DEFAULT_ORGAN_TYPE;
        this.path = path || `${DEFAULT_PATH}/${this.type}`;
    }

    /**
     * This methods creates if not exists a connector config file. 
     * @param  {any} spinalConnection
     * @param  {spinal.Model} element
     * @returns Promise
     */
    public createOrganConfigFile(spinalConnection: any, element?: spinal.Model): Promise<IConnectorCreation> {

        return new Promise((resolve) => {
            spinalConnection.load_or_make_dir(`${this.path}`, (directory) => {
                console.log(this.name, this.path);

                for (let index = 0; index < directory.length; index++) {
                    const element = directory[index];
                    const elementName = element.name.get();
                    if (elementName.toLowerCase() === `${this.name}.conf`.toLowerCase()) {
                        return element.load(async (organ) => {
                            resolve({ alreadyExist: true, node: organ, instancePm2: await this.getPm2Instance() });
                        });
                    }
                }

                console.log("organ not found")

                const model = new SpinalConnector(this.name, this.type, element);
                return waitModelReady().then(async () => {
                    console.log("model ready");

                    const file = new File(`${this.name}.conf`.toLowerCase(), model, undefined);
                    directory.push(file);

                    return resolve({ alreadyExist: false, node: model, instancePm2: await this.getPm2Instance() });
                })
            })
        });
    }

    public getPm2Instance(): Promise<any> {
        return new Promise((resolve, reject) => {
            pm2.list((err, apps) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                const instance = apps.find(app => app.name === this.name);
                resolve(instance);

            })
        });
    }

}