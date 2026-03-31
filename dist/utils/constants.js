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
exports.PILOT_STATES = exports.STATES = exports.QueueEvents = exports.CONTEXT_TO_ORGAN_RELATION = exports.DEFAULT_PATH = exports.DEFAULT_ORGAN_TYPE = void 0;
exports.DEFAULT_ORGAN_TYPE = "SPINAL_ORGAN";
exports.DEFAULT_PATH = "/etc/Organs";
exports.CONTEXT_TO_ORGAN_RELATION = "hasBmsNetworkOrgan";
exports.QueueEvents = {
    FINISH: "finish",
    START: "start",
};
exports.STATES = {
    initial: "initial",
    readyToDiscover: "readyToDiscover",
    discovering: "discovering",
    discovered: "discovered",
    readyToCreate: "readyToCreate",
    creating: "creating",
    created: "created",
    error: "error",
    timeout: "timeout",
    cancelled: "cancelled",
    pending: "pending",
    stopped: "stopped"
};
exports.PILOT_STATES = {
    init: "init",
    processing: "processing",
    success: "success",
    error: "error"
};
//# sourceMappingURL=constants.js.map