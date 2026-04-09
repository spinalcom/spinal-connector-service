import { Model } from "spinal-core-connectorjs";
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
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
declare class SpinalListener extends Model {
    constructor(graph?: SpinalGraph, context?: SpinalContext, organ?: SpinalNode, network?: SpinalNode, bmsDevice?: SpinalNode, profile?: SpinalNode);
    getGraph(): Promise<SpinalNode>;
    getOrgan(): Promise<SpinalNode>;
    getContext(): Promise<SpinalContext>;
    getBmsDevice(): Promise<SpinalNode>;
    getNetwork(): Promise<SpinalNode>;
    getProfile(): Promise<SpinalNode>;
    addToGraph(): Promise<number>;
    removeFromGraph(): Promise<boolean>;
    addToDevice(): Promise<void>;
}
export { SpinalListener };
export default SpinalListener;
