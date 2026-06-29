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
exports.SpinalDiscover = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
// import { v4 as uuidv4 } from "uuid";
const constants_1 = require("../utils/constants");
const functions_1 = require("../utils/functions");
const gzip = require("node-gzip");
/**
 * Represents a discovery model for managing and tracking the discovery process
 * of models within a SpinalGraph context. This class provides methods to interact
 * with the graph, context, and organ nodes, as well as to manage the state and
 * discovered/created trees associated with the discovery process.
 *
 * @template T - The type of model managed by the discovery process.
 * @extends Model
 *
 * @remarks
 * - Handles the initialization of discovery attributes, including references to
 *   the graph, context, and organ nodes.
 * - Provides asynchronous methods to retrieve associated nodes and contexts.
 * - Manages the state of the discovery process using a set of predefined states.
 * - Supports adding and removing the discovery model from the graph.
 * - Handles compression and storage of discovered and to-be-created trees.
 *
 * @example
 * ```typescript
 * const discover = new SpinalDiscover<MyModel>(graph, context, organ);
 * await discover.addToGraph();
 * await discover.setTreeDiscovered(treeJson);
 * const discoveredTree = await discover.getTreeDiscovered();
 * ```
 *
 * @method getGraph(): Retrieves the associated SpinalGraph node.
 * @method getOrgan(): Retrieves the associated organ SpinalNode.
 * @method getContext(): Retrieves the associated SpinalContext.
 * @method changeState(state: keyof typeof STATES): Changes the state of the discovery process.
 * @method addToGraph(): Adds the discovery model to the graph.
 * @method removeFromGraph(): Removes the discovery model from the graph.
 * @method setTreeDiscovered(json: any): Compresses and stores the discovered tree data.
 * @method setTreeToCreate(json: any): Compresses and stores the to-be-created tree data.
 * @method getTreeDiscovered(hubUrl?: string): Retrieves and decompresses the discovered tree data.
 * @method getTreeToCreate(hubUrl?: string): Retrieves and decompresses the to-be-created tree data.
 *
 */
class SpinalDiscover extends spinal_core_connectorjs_1.Model {
    constructor(graph, context, organ) {
        super();
        if (!graph || !context || !organ)
            return;
        const choicesSet = new Set(Object.keys(constants_1.STATES));
        this.add_attr({
            id: (0, functions_1.guid)("SpinalDiscover"),
            graph: graph && new spinal_core_connectorjs_1.Pbr(graph),
            context: context && new spinal_core_connectorjs_1.Pbr(context),
            organ: organ && new spinal_core_connectorjs_1.Pbr(organ),
            creation: Date.now(),
            state: new spinal_core_connectorjs_1.Choice(0, Array.from(choicesSet)),
            treeDiscovered: new spinal_core_connectorjs_1.Ptr(),
            treeToCreate: new spinal_core_connectorjs_1.Ptr(),
        });
    }
    getGraph() {
        return (0, functions_1.loadPtr)(this.graph);
    }
    getOrgan() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, functions_1.loadPtr)(this.organ);
        });
    }
    getContext() {
        return (0, functions_1.loadPtr)(this.context);
    }
    changeState(state) {
        if (!constants_1.STATES[state])
            throw new Error(`${state} is not a valid state`);
        const choicesSet = new Set(Object.keys(constants_1.STATES));
        this.state.set(Array.from(choicesSet).indexOf(state));
    }
    addToGraph() {
        return this.getOrgan().then((organNode) => __awaiter(this, void 0, void 0, function* () {
            const organ = yield organNode.getElement(true);
            return organ.addDiscoverModelToGraph(this);
        }));
    }
    removeFromGraph() {
        return this.getOrgan().then((organNode) => __awaiter(this, void 0, void 0, function* () {
            const organ = yield organNode.getElement(true);
            return organ.removeDiscoverModelFromGraph(this);
        }));
    }
    setTreeDiscovered(json) {
        return __awaiter(this, void 0, void 0, function* () {
            const compressed = yield gzip.gzip(JSON.stringify(json));
            const path = new spinal_core_connectorjs_1.Path(compressed);
            if (this.treeDiscovered)
                this.rem_attr("treeDiscovered");
            this.add_attr({ treeDiscovered: new spinal_core_connectorjs_1.Ptr(path) });
        });
    }
    setTreeToCreate(json) {
        return __awaiter(this, void 0, void 0, function* () {
            const compressed = yield gzip.gzip(JSON.stringify(json));
            const path = new spinal_core_connectorjs_1.Path(compressed);
            if (this.treeToCreate)
                this.rem_attr("treeToCreate");
            this.add_attr({ treeToCreate: new spinal_core_connectorjs_1.Ptr(path) });
        });
    }
    getTreeDiscovered(hubUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathData = yield (0, functions_1.getPathData)(this.treeDiscovered.data.value, hubUrl);
            const decompressed = yield gzip.ungzip(pathData);
            return JSON.parse(decompressed.toString());
        });
    }
    getTreeToCreate(hubUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathData = yield (0, functions_1.getPathData)(this.treeToCreate.data.value, hubUrl);
            const decompressed = yield gzip.ungzip(pathData);
            return JSON.parse(decompressed.toString());
        });
    }
}
exports.SpinalDiscover = SpinalDiscover;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalDiscover]);
exports.default = SpinalDiscover;
//# sourceMappingURL=SpinalDiscover.js.map