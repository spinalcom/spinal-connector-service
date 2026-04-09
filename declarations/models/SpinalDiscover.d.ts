import { Model } from "spinal-core-connectorjs";
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { STATES } from "../utils/constants";
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
declare class SpinalDiscover extends Model {
    constructor(graph?: SpinalGraph, context?: SpinalContext, organ?: SpinalNode);
    getGraph(): Promise<SpinalNode>;
    getOrgan(): Promise<SpinalNode>;
    getContext(): Promise<SpinalContext>;
    changeState(state: keyof typeof STATES): void;
    addToGraph(): Promise<number>;
    removeFromGraph(): Promise<boolean>;
    setTreeDiscovered(json: any): Promise<void>;
    setTreeToCreate(json: any): Promise<void>;
    getTreeDiscovered(hubUrl?: string): Promise<any>;
    getTreeToCreate(hubUrl?: string): Promise<any>;
}
export default SpinalDiscover;
export { SpinalDiscover };
