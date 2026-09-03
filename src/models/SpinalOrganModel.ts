import { Lst, Model, Ptr, spinalCore } from "spinal-core-connectorjs";
import { CONTEXT_TO_ORGAN_RELATION, DEFAULT_ORGAN_TYPE } from "../utils/constants";
// import { v4 as uuidv4 } from "uuid";
import { SpinalNode, SPINAL_RELATION_PTR_LST_TYPE, SpinalContext } from "spinal-model-graph";
import ModelsInfo from "./ModelsInfo";
import { guid, loadPtr } from "../utils/functions";
import { _compareDeviceListeners, getDeviceListener, getOrganDeviceNode } from "../utils/lifecycle";

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
class SpinalOrganModel<D extends Model = any, P extends Model = any, L extends Model = any> extends Model {
	constructor(name?: string, type: string = DEFAULT_ORGAN_TYPE) {
		super();

		if (!type || !name) return;
		this.add_attr({
			id: guid("SpinalOrganModel"),
			name: name,
			type: type,
			references: {},
			restart: false,
			discover: new ModelsInfo<D>(),
			pilot: new ModelsInfo<P>(),
			listener: new ModelsInfo<L>(),
		});
	}

	public getModels(): { discover?: ModelsInfo<D>; pilot?: ModelsInfo<P>; listener?: ModelsInfo<L> } {
		return { discover: this.discover, pilot: this.pilot, listener: this.listener };
	}

	public async linkOrganToContext(context: SpinalContext): Promise<boolean> {
		const contextId = context.getId().get();
		if (this.isReferencedInContext(contextId)) throw new Error(`Organ is already referenced in context`);

		const node = new SpinalNode(this.name.get(), this.type.get(), this as any);

		return context.addChildInContext(node, CONTEXT_TO_ORGAN_RELATION, SPINAL_RELATION_PTR_LST_TYPE, context).then(() => {
			this.addReference(contextId, node);
			return true;
		});
	}

	public async unlinkOrganFromContext(context: SpinalContext): Promise<boolean> {
		const contextId = context.getId().get();

		if (!this.isReferencedInContext(contextId)) throw new Error(`Organ is not referenced in context`);
		const node = (await loadPtr(this.references[contextId])) as SpinalNode;

		if (!node) throw new Error(`Referenced node not found in graph`);

		return context.removeChild(node, CONTEXT_TO_ORGAN_RELATION, SPINAL_RELATION_PTR_LST_TYPE).then((result) => {
			this.removeReference(contextId);
			return true;
		});
	}

	public isReferencedInContext(contextId: string): boolean {
		return typeof this.references[contextId] !== "undefined";
	}

	public getAllContextIds(): string[] {
		return this.references._attribute_names || [];
	}

	public async getReferenceByContext(contextId: string): Promise<SpinalNode | null> {
		if (!this.isReferencedInContext(contextId)) return null;
		const node = (await loadPtr(this.references[contextId])) as SpinalNode;
		return node || null;
	}

	public addReference(contextId: string, spinalNode: SpinalNode): SpinalNode {
		const refFound = this.references[contextId];
		if (refFound) this.references.rem_attr(contextId);

		this.references.add_attr({ [contextId]: new Ptr(spinalNode) });
		return spinalNode;
	}

	public async getAllReferences(): Promise<{ [contextId: string]: SpinalNode }> {
		const contextIds = this.getAllContextIds();

		const promises = contextIds.map(async (contextId) => {
			const node = await this.getReferenceByContext(contextId);
			return [contextId, node] as [string, SpinalNode];
		});

		const entries = await Promise.all(promises);
		return Object.fromEntries(entries);
	}

	public removeReference(contextId: string): void {
		if (this.isReferencedInContext(contextId)) this.references.rem_attr(contextId);
	}

	public initializeModelsList() {
		if (!this.discover) this.add_attr({ discover: new ModelsInfo<D>() });
		if (!this.pilot) this.add_attr({ pilot: new ModelsInfo<P>() });
		if (!this.listener) this.add_attr({ listener: new ModelsInfo<L>() });
	}

	public async checkOrganDataValidity(): Promise<{ valid: boolean; message?: string }> {
		try {
			this._checkModelValidity();
			await this._checkListenerValidity();
		} catch (error: any) {
			return { valid: false, message: error.message };
		}

		return { valid: true };
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
		return this.discover.getList();
	}

	public getPilotModelFromGraph(): Promise<Lst<P> | undefined> {
		if (!this.pilot) return Promise.resolve(undefined);
		return this.pilot.getList();
	}

	public getListenerModelFromGraph(): Promise<Lst<L> | undefined> {
		if (!this.listener) return Promise.resolve(undefined);
		return this.listener.getList();
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

	private _checkModelValidity(): boolean {
		if (!(this.discover instanceof ModelsInfo)) throw `"Discover" property on organ Model is not valid`;
		if (!(this.listener instanceof ModelsInfo)) throw `"Listener" property on organ Model is not valid`;
		if (!(this.pilot instanceof ModelsInfo)) throw `"Pilot" property on organ Model is not valid`;

		return true;
	}

	private async _checkListenerValidity(): Promise<boolean> {
		const listenerModels = await this.getListenerModelFromGraph();
		const devices = await getOrganDeviceNode(this);
		const deviceListeners = await getDeviceListener(Object.values(devices).flat());

		const comparisonResult = await _compareDeviceListeners(Array.from(listenerModels || []), deviceListeners);
		if (!comparisonResult.valid) throw comparisonResult.message;

		return true;
	}
}

spinalCore.register_models([SpinalOrganModel]);
export default SpinalOrganModel;
export { SpinalOrganModel };
