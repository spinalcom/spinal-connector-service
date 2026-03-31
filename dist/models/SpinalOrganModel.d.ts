import { Lst, Model } from "spinal-core-connectorjs";
import { SpinalNode, SpinalContext } from "spinal-model-graph";
import ModelsInfo from "./ModelsInfo";
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
declare class SpinalOrganModel<D extends Model = any, P extends Model = any, L extends Model = any> extends Model {
    constructor(name?: string, type?: string);
    getModels(): {
        discover?: ModelsInfo<D>;
        pilot?: ModelsInfo<P>;
        listener?: ModelsInfo<L>;
    };
    linkOrganToContext(context: SpinalContext): Promise<boolean>;
    unlinkOrganFromContext(context: SpinalContext): Promise<boolean>;
    isReferencedInContext(contextId: string): boolean;
    addReference(contextId: string, spinalNode: SpinalNode): SpinalNode;
    removeReference(contextId: string): void;
    initializeModelsList(): void;
    addDiscoverModelToGraph(discoverModel: D): Promise<number>;
    addPilotModelToGraph(pilotModel: P): Promise<number>;
    addListenerModelToGraph(listenerModel: L): Promise<number>;
    removeDiscoverModelFromGraph(discoverModel: D): Promise<boolean>;
    removePilotModelFromGraph(pilotModel: P): Promise<boolean>;
    removeListenerModelFromGraph(listenerModel: L): Promise<boolean>;
    getDiscoverModelFromGraph(): Promise<Lst<D> | undefined>;
    getPilotModelFromGraph(): Promise<Lst<P> | undefined>;
    getListenerModelFromGraph(): Promise<Lst<L> | undefined>;
    consumeDiscoverModelFromGraph(): Promise<D[]>;
    consumePilotModelFromGraph(): Promise<P[]>;
    consumeListenerModelFromGraph(): Promise<L[]>;
}
export default SpinalOrganModel;
export { SpinalOrganModel };
