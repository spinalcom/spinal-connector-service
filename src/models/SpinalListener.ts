import { Model, Pbr, spinalCore } from "spinal-core-connectorjs";
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { v4 as uuidv4 } from "uuid";
import { loadPtr } from "../utils/functions";




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
class SpinalListener extends Model {
    constructor(graph?: SpinalGraph, context?: SpinalContext, organ?: SpinalNode, network?: SpinalNode, bmsDevice?: SpinalNode, profile?: SpinalNode) {
        super();
        if (!graph || !context || !organ || !network || !bmsDevice || !profile) return;

        this.add_attr({
            id: uuidv4(),
            monitored: true,
            network: new Pbr(network),
            organ: new Pbr(organ),
            context: new Pbr(context),
            graph: new Pbr(graph),
            bmsDevice: new Pbr(bmsDevice),
            profile: new Pbr(profile)
        })
    }

    public getGraph(): Promise<SpinalNode> {
        return loadPtr(this.graph);
    }

    public getOrgan(): Promise<SpinalNode> {
        return loadPtr(this.organ);
    }

    public getContext(): Promise<SpinalContext> {
        return loadPtr(this.context);
    }

    public getBmsDevice(): Promise<SpinalNode> {
        return loadPtr(this.bmsDevice);
    }

    public getNetwork(): Promise<SpinalNode> {
        return loadPtr(this.network);
    }

    public getProfile(): Promise<SpinalNode> {
        return loadPtr(this.profile);
    }

    public addToGraph(): Promise<number> {
        return this.getOrgan().then(async (organNode: SpinalNode) => {
            const organModel = await organNode.getElement(true);
            if (organModel) {
                await this.addToDevice(); // add reference to listener in device
                return organModel.addListenerModelToGraph(this); // add listener to organ listener list
            }
        })
    }

    public removeFromGraph(): Promise<boolean> {
        const promises = [this.getOrgan(), this.getBmsDevice()];

        return Promise.all(promises).then(async ([organNode, deviceNode]: SpinalNode[]) => {
            const organModel = await organNode.getElement(true);
            if (organModel) {
                deviceNode.info.remove_attr('listener'); // remove reference to listener in device
                return organModel.removeListenerModelFromGraph(this); // remove listener from organ listener list
            }
        })
    }

    public addToDevice() {
        return this.getBmsDevice().then((device) => {
            if (device.info.listeners) device.info.rem_attr('listener');

            device.info.add_attr({ listener: new Pbr(this) });
        });
    }

}


spinalCore.register_models([SpinalListener]);
export { SpinalListener };
export default SpinalListener;
