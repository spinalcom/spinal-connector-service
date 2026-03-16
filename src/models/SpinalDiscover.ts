import { Choice, Model, Pbr, Ptr, spinalCore, Path as SpinalPath, } from "spinal-core-connectorjs";
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { v4 as uuidv4 } from "uuid";
import { STATES } from "../utils/constants";
import ModelsInfo from "./ModelsInfo";
import { getPathData, loadPtr } from "../utils/functions";
import * as gzip from "node-gzip"


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
class SpinalDiscover extends Model {
    constructor(graph?: SpinalGraph, context?: SpinalContext, organ?: SpinalNode) {
        super();
        if (!graph || !context || !organ) return;

        const choicesSet = new Set(Object.keys(STATES));

        this.add_attr({
            id: uuidv4(),
            graph: graph && new Pbr(graph),
            context: context && new Pbr(context),
            organ: organ && new Pbr(organ),
            creation: Date.now(),
            state: new Choice(0, Array.from(choicesSet)),
            treeDiscovered: new Ptr(),
            treeToCreate: new Ptr(),
        })
    }

    public getGraph(): Promise<SpinalNode> {
        return loadPtr(this.graph);
    }

    public async getOrgan(): Promise<SpinalNode> {
        return loadPtr(this.organ);
    }

    public getContext(): Promise<SpinalContext> {
        return loadPtr(this.context);
    }

    public changeState(state: keyof typeof STATES) {
        if (!STATES[state]) throw new Error(`${state} is not a valid state`);

        const choicesSet = new Set(Object.keys(STATES));
        this.state.set(Array.from(choicesSet).indexOf(state));
    }

    public addToGraph(): Promise<number> {
        return this.getOrgan().then(async (organNode: SpinalNode) => {
            const organ: ModelsInfo = await organNode.getElement(true);
            return organ.addDiscoverModelToGraph(this);
        });
    }

    public removeFromGraph(): Promise<boolean> {
        return this.getOrgan().then(async (organNode: SpinalNode) => {
            const organ: ModelsInfo = await organNode.getElement(true);

            return organ.removeDiscoverModelFromGraph(this);
        });
    }

    public async setTreeDiscovered(json: any) {
        const compressed = await gzip.gzip(JSON.stringify(json));
        const path = new SpinalPath(compressed);
        if (this.treeDiscovered) this.rem_attr("treeDiscovered");

        this.add_attr({ treeDiscovered: new Ptr(path) });
    }

    public async setTreeToCreate(json: any) {
        const compressed = await gzip.gzip(JSON.stringify(json));
        const path = new SpinalPath(compressed);
        if (this.treeToCreate) this.rem_attr("treeToCreate");

        this.add_attr({ treeToCreate: new Ptr(path) });
    }

    public async getTreeDiscovered(hubUrl?: string) {
        const pathData = await getPathData(this.treeDiscovered.data.value, hubUrl);
        const decompressed = await gzip.ungzip(pathData);
        return JSON.parse(decompressed.toString());
    }


    public async getTreeToCreate(hubUrl?: string) {
        const pathData = await getPathData(this.treeToCreate.data.value, hubUrl);
        const decompressed = await gzip.ungzip(pathData);
        return JSON.parse(decompressed.toString());

    }

}

spinalCore.register_models([SpinalDiscover]);

export default SpinalDiscover;
export { SpinalDiscover };