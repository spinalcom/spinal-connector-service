import { Lst, Model, Ptr, spinalCore } from "spinal-core-connectorjs";
import { DEFAULT_ORGAN_TYPE } from "../utils/constants";
import { v4 as uuidv4 } from "uuid";
import { SpinalNode } from "spinal-env-viewer-graph-service";
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
 * @methods 
 * - `addReference(contextId: string, spinalNode: SpinalNode): SpinalNode` - Adds a reference to a context.
 * - `isReferencedInContext(contextId: string): boolean` - Checks if the organ is referenced in a specific context.
 * - `removeReference(contextId: string): void` - Removes a reference to a context.
 * - `addDiscoverModelToGraph(discoverModel: D): Promise<number>` - Adds a discover model to the graph.
 * - `addPilotModelToGraph(pilotModel: P): Promise<number>` - Adds a pilot model to the graph.
 * - `addListenerModelToGraph(listenerModel: L): Promise<number>` - Adds a listener model to the graph.
 * - `removeDiscoverModelFromGraph(discoverModel: D): Promise<boolean>` - Removes a discover model from the graph.
 * - `removePilotModelFromGraph(pilotModel: P): Promise<boolean>` - Removes a pilot model from the graph.
 * - `removeListenerModelFromGraph(listenerModel: L): Promise<boolean>` - Removes a listener model from the graph.
 * - `getDiscoverModelFromGraph(): Promise<Lst<D> | undefined>` - Retrieves the list of discover models from the graph.
 * - `getPilotModelFromGraph(): Promise<Lst<P> | undefined>` - Retrieves the list of pilot models from the graph.
 * - `getListenerModelFromGraph(): Promise<Lst<L> | undefined>` - Retrieves the list of listener models from the graph.
 * - `consumeDiscoverModelFromGraph(): Promise<D[]>` - Consumes and retrieves all discover models from the graph.
 * - `consumePilotModelFromGraph(): Promise<P[]>` - Consumes and retrieves all pilot models from the graph.
 * - `consumeListenerModelFromGraph(): Promise<L[]>` - Consumes and retrieves all listener models from the graph.
 * 
 * @see {@link ModelsInfo} for managing collections of models.
 */
class SpinalOrganModel<D extends Model = any, P extends Model = any, L extends Model = any> extends Model {

    constructor(name?: string, type: string = DEFAULT_ORGAN_TYPE) {
        super();

        if (!type || !name) return;
        this.add_attr({
            id: uuidv4(),
            name: name,
            type: type,
            references: {},
            restart: false,
            discover: new ModelsInfo<D>(),
            pilot: new ModelsInfo<P>(),
            listener: new ModelsInfo<L>()
        });
    }


    public addReference(contextId: string, spinalNode: SpinalNode): SpinalNode {
        const refFound = this.references[contextId];
        if (refFound) this.references.rem_attr(contextId);

        this.references.add_attr({ [contextId]: new Ptr(spinalNode) });
        return spinalNode;
    }


    public isReferencedInContext(contextId: string): boolean {
        return typeof this.references[contextId] !== "undefined";
    }


    public removeReference(contextId: string): void {
        if (this.isReferencedInContext(contextId)) this.references.rem_attr(contextId);
    }



    public initializeModelsList() {
        if (!this.discover) this.add_attr({ discover: new ModelsInfo<D>() });
        if (!this.pilot) this.add_attr({ pilot: new ModelsInfo<P>() });
        if (!this.listener) this.add_attr({ listener: new ModelsInfo<L>() });
    }


    ////////////// ADD MODELS //////////////

    public addDiscoverModelToGraph(discoverModel: D): Promise<number> {
        if (!this.discover) this.add_attr({ discover: new ModelsInfo<D>() });
        return this.discover.addModel(discoverModel);
    }



    public addPilotModelToGraph(pilotModel: P): Promise<number> {
        if (!this.pilot) this.add_attr({ pilot: new ModelsInfo<P>() });
        return this.pilot.addModel(pilotModel);
    }

    public addListenerModelToGraph(listenerModel: L): Promise<number> {
        if (!this.listener) this.add_attr({ listener: new ModelsInfo<L>() });
        return this.listener.addModel(listenerModel);
    }


    ////////////// REMOVE MODELS //////////////

    public removeDiscoverModelFromGraph(discoverModel: D): Promise<boolean> {
        if (this.discover) return this.discover.removeModel(discoverModel);
        return Promise.resolve(false);
    }



    public removePilotModelFromGraph(pilotModel: P): Promise<boolean> {
        if (this.pilot) return this.pilot.removeModel(pilotModel);
        return Promise.resolve(false);
    }


    public removeListenerModelFromGraph(listenerModel: L): Promise<boolean> {
        if (this.listener) return this.listener.removeModel(listenerModel);
        return Promise.resolve(false);
    }

    ////////////// GETTERS //////////////


    public getDiscoverModelFromGraph(): Promise<Lst<D> | undefined> {
        if (!this.discover) return Promise.resolve(undefined);
        return this.discover.getModels();
    }


    public getPilotModelFromGraph(): Promise<Lst<P> | undefined> {
        if (!this.pilot) return Promise.resolve(undefined);
        return this.pilot.getModels();
    }

    public getListenerModelFromGraph(): Promise<Lst<L> | undefined> {
        if (!this.listener) return Promise.resolve(undefined);
        return this.listener.getModels();
    }


    ////////////// CONSUMERS //////////////

    public consumeDiscoverModelFromGraph(): Promise<D[]> {
        if (!this.discover) return Promise.resolve([]);
        return this.discover.consumeModels();
    }

    public consumePilotModelFromGraph(): Promise<P[]> {
        if (!this.pilot) return Promise.resolve([]);
        return this.pilot.consumeModels();
    }

    public consumeListenerModelFromGraph(): Promise<L[]> {
        if (!this.listener) return Promise.resolve([]);
        return this.listener.consumeModels();
    }


}

spinalCore.register_models([SpinalOrganModel]);
export default SpinalOrganModel;
export { SpinalOrganModel };

