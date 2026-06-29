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
exports.SpinalListener = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const uuid_1 = require("uuid");
const functions_1 = require("../utils/functions");
/**
 * Represents a listener model within the Spinal platform, responsible for monitoring and managing
 * relationships between various nodes such as graph, context, organ, network, BMS device, and profile.
 *
 * @remarks
 * The `SpinalListener` class extends the base `Model` class and encapsulates logic for adding and removing
 * itself from the graph, as well as managing references within associated device and organ nodes.
 *
 * @constructor
 * @param graph - The main SpinalGraph node.
 * @param context - The SpinalContext node associated with this listener.
 * @param organ - The organ SpinalNode to which this listener is attached.
 * @param network - The network SpinalNode associated with this listener.
 * @param bmsDevice - The BMS device SpinalNode monitored by this listener.
 * @param profile - The profile SpinalNode associated with this listener.
 *
 * @method getGraph - Retrieves the associated graph node.
 * @method getOrgan - Retrieves the associated organ node.
 * @method getContext - Retrieves the associated context node.
 * @method getBmsDevice - Retrieves the associated BMS device node.
 * @method getNetwork - Retrieves the associated network node.
 * @method getProfile - Retrieves the associated profile node.
 * @method addToGraph - Adds this listener to the organ's listener list and updates the device reference.
 * @method removeFromGraph - Removes this listener from the organ's listener list and device reference.
 * @method addToDevice - Adds a reference to this listener in the associated BMS device node.
 */
class SpinalListener extends spinal_core_connectorjs_1.Model {
    constructor(graph, context, organ, network, bmsDevice, profile) {
        super();
        if (!graph || !context || !organ || !network || !bmsDevice || !profile)
            return;
        this.add_attr({
            id: (0, uuid_1.v4)(),
            monitored: true,
            network: new spinal_core_connectorjs_1.Pbr(network),
            organ: new spinal_core_connectorjs_1.Pbr(organ),
            context: new spinal_core_connectorjs_1.Pbr(context),
            graph: new spinal_core_connectorjs_1.Pbr(graph),
            bmsDevice: new spinal_core_connectorjs_1.Pbr(bmsDevice),
            profile: new spinal_core_connectorjs_1.Pbr(profile),
        });
    }
    getGraph() {
        return (0, functions_1.loadPtr)(this.graph);
    }
    getOrgan() {
        return (0, functions_1.loadPtr)(this.organ);
    }
    getContext() {
        return (0, functions_1.loadPtr)(this.context);
    }
    getBmsDevice() {
        return (0, functions_1.loadPtr)(this.bmsDevice);
    }
    getNetwork() {
        return (0, functions_1.loadPtr)(this.network);
    }
    getProfile() {
        return (0, functions_1.loadPtr)(this.profile);
    }
    addToGraph() {
        return this.getOrgan().then((organNode) => __awaiter(this, void 0, void 0, function* () {
            const organModel = yield organNode.getElement(true);
            if (organModel) {
                yield this.addToDevice(); // add reference to listener in device
                return organModel.addListenerModelToGraph(this); // add listener to organ listener list
            }
        }));
    }
    removeFromGraph() {
        const promises = [this.getOrgan(), this.getBmsDevice()];
        return Promise.all(promises).then(([organNode, deviceNode]) => __awaiter(this, void 0, void 0, function* () {
            const organModel = yield organNode.getElement(true);
            if (organModel) {
                deviceNode.info.rem_attr("listener"); // remove reference to listener in device
                return organModel.removeListenerModelFromGraph(this); // remove listener from organ listener list
            }
        }));
    }
    addToDevice() {
        return this.getBmsDevice().then((device) => {
            if (device.info.listener)
                device.info.rem_attr("listener");
            device.info.add_attr({ listener: new spinal_core_connectorjs_1.Pbr(this) });
        });
    }
}
exports.SpinalListener = SpinalListener;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalListener]);
exports.default = SpinalListener;
//# sourceMappingURL=SpinalListener.js.map