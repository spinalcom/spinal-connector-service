import { Model } from "spinal-core-connectorjs";
import { SpinalNode } from "spinal-env-viewer-graph-service";
import { PILOT_STATES } from "../utils/constants";
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
declare class SpinalPilot<RequestType> extends Model {
    constructor(organ?: SpinalNode, requests?: RequestType | RequestType[]);
    changeSatte(newState: keyof typeof PILOT_STATES): void;
    setInitMode(): void;
    setProcessMode(): void;
    setSuccessMode(): void;
    setErrorMode(): void;
    getOrgan(): Promise<SpinalNode>;
    addToGraph(): Promise<number>;
    removeFromGraph(): Promise<boolean>;
    addToNode(endpoint: SpinalNode): Promise<number>;
    removeFromNode(): Promise<boolean>;
}
export { SpinalPilot };
export default SpinalPilot;
