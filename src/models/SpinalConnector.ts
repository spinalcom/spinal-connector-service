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

import { SpinalNode } from "spinal-model-graph";
import { DEFAULT_ORGAN_TYPE } from "../utils/constants";
import { FileSystem, spinalCore } from 'spinal-core-connectorjs_type';
import { guid } from "../utils/functions";

export default class SpinalConnector<Type extends spinal.Model> extends SpinalNode<Type> {
    constructor(name: string = '', type: string = DEFAULT_ORGAN_TYPE, element?: Type) {
        super(name, type, element);
        if (!FileSystem._sig_server) return;

        this.info.id.set(guid(this.constructor.name));
    }

    // public getElement(): Promise<Type> {
    //     return new Promise((resolve, reject) => {
    //         this.element.ptr.load(data => resolve(data));
    //     });

    // }
}

spinalCore.register_models([SpinalConnector]);
export { SpinalConnector }