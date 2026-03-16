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
exports.SpinalPilot = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const uuid_1 = require("uuid");
const constants_1 = require("../utils/constants");
const functions_1 = require("../utils/functions");
/**
 * Represents a pilot model that manages the state and association of a pilot process
 * with a specific organ node and a set of requests in the Spinal platform.
 *
 * @template T - The type of requests handled by the pilot.
 * @extends Model
 *
 * @remarks
 * The `SpinalPilot` class encapsulates the logic for managing pilot states, associating
 * with organ nodes, and handling requests. It provides methods to transition between
 * different pilot states (init, processing, success, error), and to add or remove itself
 * from the graph or a specific node.
 *
 * @param organ - The organ node to associate with the pilot.
 * @param requests - The requests to be managed by the pilot. Can be a single request or an array of requests.
 *
 * @property id - Unique identifier for the pilot instance.
 * @property state - The current state of the pilot, represented as a choice from `PILOT_STATES`.
 * @property creation - Timestamp of pilot creation.
 * @property organ - Reference to the associated organ node.
 * @property requests - The list of requests managed by the pilot.
 * @property node - (Optional) The node to which the pilot is attached.
 *
 * @method setInitMode - Sets the pilot state to `init`.
 * @method setProcessMode - Sets the pilot state to `processing`.
 * @method setSuccessMode - Sets the pilot state to `success`.
 * @method setErrorMode - Sets the pilot state to `error`.
 * @method getOrgan - Loads and returns the associated organ node.
 * @method addToGraph - Adds the pilot model to the organ's graph.
 * @method removeFromGraph - Removes the pilot model from the organ's graph.
 * @method addToNode - Attaches the pilot to a given endpoint node.
 * @method removeFromNode - Removes the pilot from its associated node.
 */
class SpinalPilot extends spinal_core_connectorjs_1.Model {
    constructor(organ, requests) {
        super();
        if (!organ || !requests)
            return;
        const choicesSet = new Set(Object.keys(constants_1.PILOT_STATES));
        this.add_attr({
            id: (0, uuid_1.v4)(),
            state: new spinal_core_connectorjs_1.Choice(0, Array.from(choicesSet)),
            creation: Date.now(),
            organ: new spinal_core_connectorjs_1.Pbr(organ),
            requests: Array.isArray(requests) ? requests : [requests],
        });
    }
    changeState(newState) {
        if (!constants_1.PILOT_STATES[newState])
            throw new Error(`${newState} is not a valid state`);
        const choicesSet = new Set(Object.keys(constants_1.PILOT_STATES));
        this.state.set(Array.from(choicesSet).indexOf(newState));
    }
    setInitMode() {
        this.changeState(constants_1.PILOT_STATES.init);
    }
    setProcessMode() {
        this.changeState(constants_1.PILOT_STATES.processing);
    }
    setSuccessMode() {
        this.changeState(constants_1.PILOT_STATES.success);
    }
    setErrorMode() {
        this.changeState(constants_1.PILOT_STATES.error);
    }
    getOrgan() {
        return (0, functions_1.loadPtr)(this.organ);
    }
    addToGraph() {
        return this.getOrgan().then((organNode) => __awaiter(this, void 0, void 0, function* () {
            const organModel = yield organNode.getElement(true);
            if (organModel) {
                return organModel.addPilotModelToGraph(this);
            }
            return -1;
        }));
    }
    removeFromGraph() {
        return this.getOrgan().then((organNode) => __awaiter(this, void 0, void 0, function* () {
            const organModel = yield organNode.getElement(true);
            if (organModel) {
                return organModel.removePilotModelFromGraph(this);
            }
            return false;
        }));
    }
    addToNode(endpoint) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.add_attr({ node: endpoint });
                if (!((_a = endpoint === null || endpoint === void 0 ? void 0 : endpoint.info) === null || _a === void 0 ? void 0 : _a.pilot)) {
                    endpoint.info.add_attr({ pilot: new spinal_core_connectorjs_1.Ptr(new spinal_core_connectorjs_1.Lst([this])) });
                    return 1;
                }
                const pilotageLst = (yield (0, functions_1.loadPtr)(endpoint.info.pilot));
                pilotageLst.push(this);
                return pilotageLst.length;
            }
            catch (error) {
                this.rem_attr("node");
                return -1;
            }
        });
    }
    removeFromNode() {
        var _a, _b;
        if (!((_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.pilot))
            return Promise.resolve(false);
        return (0, functions_1.loadPtr)(this.node.info.pilot).then((lst) => {
            for (let i = 0; i < lst.length; i++) {
                const element = lst[i];
                if (element.id.get() === this.id.get()) {
                    lst.remove(element);
                    return true;
                }
            }
            return false;
        }).catch((err) => {
            return false;
        });
    }
}
exports.SpinalPilot = SpinalPilot;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalPilot]);
exports.default = SpinalPilot;
//# sourceMappingURL=SpinalPilot.js.map