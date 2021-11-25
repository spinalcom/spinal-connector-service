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

import { spinalCore, Model, Ptr, Lst } from 'spinal-core-connectorjs_type';
import { SpinalNode } from 'spinal-env-viewer-graph-service';
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_ORGAN_TYPE } from "../utils/constants";


class SpinalOrganConfigModel extends Model {

    static CONTEXT_TO_ORGAN_RELATION: string = "hasBmsNetworkOrgan";


    constructor(name: string, type: string = DEFAULT_ORGAN_TYPE) {
        super();

        this.add_attr({
            id: uuidv4(),
            name,
            type,
            references: {},
            restart: false,
        })
    }

    public addReference(contextId: string, spinalNode: SpinalNode<any>): Promise<SpinalNode<any>> {

        if (this.references[contextId]) {
            return new Promise((resolve, reject) => {
                this.references[contextId].load((e) => {
                    if (typeof e !== "undefined") return reject("The organ is already linked to this context");
                    this.references.mod_attr(contextId, new Ptr(spinalNode));
                    resolve(spinalNode);
                })
            });

        }

        this.references.add_attr({ [contextId]: new Ptr(spinalNode) })
        return Promise.resolve(spinalNode);
    }

    public isReferencedInContext(contextId: string): Promise<boolean> {
        if (typeof this.references[contextId] === "undefined") return Promise.resolve(false);

        return new Promise((resolve, reject) => {
            this.references[contextId].load((e) => {
                if (typeof e === "undefined") return resolve(false)
                resolve(true);
            })
        });

    }

    public removeReference(contextId: string): Promise<SpinalNode<any>> {
        if (this.references[contextId]) {
            return new Promise((resolve, reject) => {
                this.references[contextId].load(node => {
                    this.references.rem_attr(contextId);
                    resolve(node);
                })
            });
        }
    }
}


spinalCore.register_models([SpinalOrganConfigModel])
export default SpinalOrganConfigModel;
export { SpinalOrganConfigModel }