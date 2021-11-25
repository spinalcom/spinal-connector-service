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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalConnector = void 0;
const spinal_model_graph_1 = require("spinal-model-graph");
const constants_1 = require("../utils/constants");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const functions_1 = require("../utils/functions");
class SpinalConnector extends spinal_model_graph_1.SpinalNode {
    constructor(name = '', type = constants_1.DEFAULT_ORGAN_TYPE, element) {
        super(name, type, element);
        if (!spinal_core_connectorjs_type_1.FileSystem._sig_server)
            return;
        this.info.id.set(functions_1.guid(this.constructor.name));
    }
}
exports.default = SpinalConnector;
exports.SpinalConnector = SpinalConnector;
spinal_core_connectorjs_type_1.spinalCore.register_models([SpinalConnector]);
//# sourceMappingURL=SpinalConnector.js.map