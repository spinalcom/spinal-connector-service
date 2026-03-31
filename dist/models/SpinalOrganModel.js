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
exports.SpinalOrganModel = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const constants_1 = require("../utils/constants");
const uuid_1 = require("uuid");
const spinal_model_graph_1 = require("spinal-model-graph");
const ModelsInfo_1 = require("./ModelsInfo");
const functions_1 = require("../utils/functions");
/**
 * Represents an Organ model in the Spinal framework, managing references and collections of models
 * for discovery, pilot, and listener functionalities. This class extends the base `Model` class and
 * provides methods to add, remove, and retrieve models from internal lists, as well as manage references
 * to contexts within a graph structure.
 *
 * @template D - The type of the discover models managed by this organ.
 * @template P - The type of the pilot models managed by this organ.
 * @template L - The type of the listener models managed by this organ.
 *
 * @remarks
 * - The organ maintains references to contexts via unique IDs and supports adding/removing models
 *   to/from discover, pilot, and listener lists.
 * - Each model list is managed by a `ModelsInfo` instance.
 * - The organ can be initialized with a name and type, and generates a unique ID upon creation.
 *
 * @example
 * ```typescript
 * const organ = new SpinalOrganModel<MyDiscoverModel, MyPilotModel, MyListenerModel>('MyOrgan', 'customType');
 * await organ.addDiscoverModelToGraph(new MyDiscoverModel());
 * ```
 *
 * @method addReference(contextId: string, spinalNode: SpinalNode): SpinalNode - Adds a reference to a context.
 * @method isReferencedInContext(contextId: string): boolean - Checks if the organ is referenced in a specific context.
 * @method removeReference(contextId: string): void - Removes a reference to a context.
 * @method addDiscoverModelToGraph(discoverModel: D): Promise<number> - Adds a discover model to the graph.
 * @method addPilotModelToGraph(pilotModel: P): Promise<number> - Adds a pilot model to the graph.
 * @method addListenerModelToGraph(listenerModel: L): Promise<number> - Adds a listener model to the graph.
 * @method removeDiscoverModelFromGraph(discoverModel: D): Promise<boolean> - Removes a discover model from the graph.
 * @method removePilotModelFromGraph(pilotModel: P): Promise<boolean> - Removes a pilot model from the graph.
 * @method removeListenerModelFromGraph(listenerModel: L): Promise<boolean> - Removes a listener model from the graph.
 * @method getDiscoverModelFromGraph(): Promise<Lst<D> | undefined> - Retrieves the list of discover models from the graph.
 * @method getPilotModelFromGraph(): Promise<Lst<P> | undefined> - Retrieves the list of pilot models from the graph.
 * @method getListenerModelFromGraph(): Promise<Lst<L> | undefined> - Retrieves the list of listener models from the graph.
 * @method consumeDiscoverModelFromGraph(): Promise<D[]> - Consumes and retrieves all discover models from the graph.
 * @method consumePilotModelFromGraph(): Promise<P[]> - Consumes and retrieves all pilot models from the graph.
 * @method consumeListenerModelFromGraph(): Promise<L[]> - Consumes and retrieves all listener models from the graph.
 *
 * @see {@link ModelsInfo} for managing collections of models.
 */
class SpinalOrganModel extends spinal_core_connectorjs_1.Model {
    constructor(name, type = constants_1.DEFAULT_ORGAN_TYPE) {
        super();
        if (!type || !name)
            return;
        this.add_attr({
            id: (0, uuid_1.v4)(),
            name: name,
            type: type,
            references: {},
            restart: false,
            discover: new ModelsInfo_1.default(),
            pilot: new ModelsInfo_1.default(),
            listener: new ModelsInfo_1.default()
        });
    }
    getModels() {
        return { discover: this.discover, pilot: this.pilot, listener: this.listener };
    }
    linkOrganToContext(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const contextId = context.getId().get();
            if (this.isReferencedInContext(contextId))
                throw new Error(`Organ is already referenced in context`);
            const node = new spinal_model_graph_1.SpinalNode(this.name.get(), this.type.get(), this);
            return context.addChildInContext(node, constants_1.CONTEXT_TO_ORGAN_RELATION, spinal_model_graph_1.SPINAL_RELATION_PTR_LST_TYPE, context)
                .then(() => {
                this.addReference(contextId, node);
                return true;
            });
        });
    }
    unlinkOrganFromContext(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const contextId = context.getId().get();
            if (!this.isReferencedInContext(contextId))
                throw new Error(`Organ is not referenced in context`);
            const node = yield (0, functions_1.loadPtr)(this.references[contextId]);
            if (!node)
                throw new Error(`Referenced node not found in graph`);
            return context.removeChild(node, constants_1.CONTEXT_TO_ORGAN_RELATION, spinal_model_graph_1.SPINAL_RELATION_PTR_LST_TYPE).then((result) => {
                this.removeReference(contextId);
                return true;
            });
        });
    }
    isReferencedInContext(contextId) {
        return typeof this.references[contextId] !== "undefined";
    }
    addReference(contextId, spinalNode) {
        const refFound = this.references[contextId];
        if (refFound)
            this.references.rem_attr(contextId);
        this.references.add_attr({ [contextId]: new spinal_core_connectorjs_1.Ptr(spinalNode) });
        return spinalNode;
    }
    removeReference(contextId) {
        if (this.isReferencedInContext(contextId))
            this.references.rem_attr(contextId);
    }
    initializeModelsList() {
        if (!this.discover)
            this.add_attr({ discover: new ModelsInfo_1.default() });
        if (!this.pilot)
            this.add_attr({ pilot: new ModelsInfo_1.default() });
        if (!this.listener)
            this.add_attr({ listener: new ModelsInfo_1.default() });
    }
    ////////////// ADD MODELS //////////////
    addDiscoverModelToGraph(discoverModel) {
        if (!this.discover)
            this.add_attr({ discover: new ModelsInfo_1.default() });
        return this.discover.addModel(discoverModel);
    }
    addPilotModelToGraph(pilotModel) {
        if (!this.pilot)
            this.add_attr({ pilot: new ModelsInfo_1.default() });
        return this.pilot.addModel(pilotModel);
    }
    addListenerModelToGraph(listenerModel) {
        if (!this.listener)
            this.add_attr({ listener: new ModelsInfo_1.default() });
        return this.listener.addModel(listenerModel);
    }
    ////////////// REMOVE MODELS //////////////
    removeDiscoverModelFromGraph(discoverModel) {
        if (this.discover)
            return this.discover.removeModel(discoverModel);
        return Promise.resolve(false);
    }
    removePilotModelFromGraph(pilotModel) {
        if (this.pilot)
            return this.pilot.removeModel(pilotModel);
        return Promise.resolve(false);
    }
    removeListenerModelFromGraph(listenerModel) {
        if (this.listener)
            return this.listener.removeModel(listenerModel);
        return Promise.resolve(false);
    }
    ////////////// GETTERS //////////////
    getDiscoverModelFromGraph() {
        if (!this.discover)
            return Promise.resolve(undefined);
        return this.discover.getList();
    }
    getPilotModelFromGraph() {
        if (!this.pilot)
            return Promise.resolve(undefined);
        return this.pilot.getList();
    }
    getListenerModelFromGraph() {
        if (!this.listener)
            return Promise.resolve(undefined);
        return this.listener.getList();
    }
    ////////////// CONSUMERS //////////////
    consumeDiscoverModelFromGraph() {
        if (!this.discover)
            return Promise.resolve([]);
        return this.discover.consumeModels();
    }
    consumePilotModelFromGraph() {
        if (!this.pilot)
            return Promise.resolve([]);
        return this.pilot.consumeModels();
    }
    consumeListenerModelFromGraph() {
        if (!this.listener)
            return Promise.resolve([]);
        return this.listener.consumeModels();
    }
}
exports.SpinalOrganModel = SpinalOrganModel;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalOrganModel]);
exports.default = SpinalOrganModel;
//# sourceMappingURL=SpinalOrganModel.js.map