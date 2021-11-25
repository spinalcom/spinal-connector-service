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
exports.s4 = exports.guid = exports.waitModelReady = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const Q = require('q');
function waitModelReady() {
    const deferred = Q.defer();
    const waitModelReadyLoop = (defer) => {
        if (!spinal_core_connectorjs_type_1.FileSystem._sig_server) {
            setTimeout(() => {
                defer.resolve(waitModelReadyLoop(defer));
            }, 200);
        }
        else {
            defer.resolve();
        }
        return defer.promise;
    };
    return waitModelReadyLoop(deferred);
}
exports.waitModelReady = waitModelReady;
;
function guid(name) {
    return `${name}-${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}-${Date.now().toString(16)}`;
}
exports.guid = guid;
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
exports.s4 = s4;
//# sourceMappingURL=functions.js.map