import { Choice, Lst, Model, Pbr, Ptr, spinalCore } from "spinal-core-connectorjs";
import { SpinalNode } from "spinal-env-viewer-graph-service";
import { v4 as uuidv4 } from "uuid";
import { PILOT_STATES } from "../utils/constants";
import { loadPtr } from "../utils/functions";
import ModelsInfo from "./ModelsInfo";
import SpinalOrganModel from "./SpinalOrganModel";


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
class SpinalPilot<RequestType> extends Model {
    constructor(organ?: SpinalNode, requests?: RequestType | RequestType[]) {
        super();
        if (!organ || !requests) return;

        const choicesSet = new Set(Object.keys(PILOT_STATES));

        this.add_attr({
            id: uuidv4(),
            state: new Choice(0, Array.from(choicesSet)),
            creation: Date.now(),
            organ: new Pbr(organ),
            requests: Array.isArray(requests) ? requests : [requests],
        })
    }

    public setInitMode(): void {
        this.state.set(PILOT_STATES.init);
    }

    public setProcessMode(): void {
        this.state.set(PILOT_STATES.processing);
    }

    public setSuccessMode(): void {
        this.state.set(PILOT_STATES.success);
    }

    public setErrorMode(): void {
        this.state.set(PILOT_STATES.error);
    }

    public getOrgan(): Promise<SpinalNode> {
        return loadPtr(this.organ);
    }

    public addToGraph(): Promise<number> {
        return this.getOrgan().then(async (organNode: SpinalNode) => {
            const organModel: SpinalOrganModel = await organNode.getElement(true);
            if (organModel) {
                return organModel.addPilotModelToGraph(this);
            }
            return -1;
        })
    }

    public removeFromGraph(): Promise<boolean> {
        return this.getOrgan().then(async (organNode: SpinalNode) => {
            const organModel: SpinalOrganModel = await organNode.getElement(true);
            if (organModel) {
                return organModel.removePilotModelFromGraph(this);
            }
            return false;
        })
    }

    public async addToNode(endpoint: SpinalNode): Promise<number> {
        try {
            this.add_attr({ node: endpoint });

            if (!endpoint?.info?.pilot) {
                endpoint.info.add_attr({ pilot: new Ptr(new Lst([this])) });
                return 1;
            }

            const pilotageLst = (await loadPtr(endpoint.info.pilot)) as Lst<any>;
            pilotageLst.push(this);

            return pilotageLst.length;
        } catch (error) {
            this.rem_attr("node");
            return -1;
        }

    }

    public removeFromNode(): Promise<boolean> {
        if (!this.node?.info?.pilot) return Promise.resolve(false);

        return loadPtr(this.node.info.pilot).then((lst: Lst<any>) => {
            for (let i = 0; i < lst.length; i++) {
                const element = lst[i];
                if (element.id.get() === this.id.get()) {
                    lst.remove(element);
                    return true;
                }
            }

            return false;
        }).catch((err) => {
            return false;
        });
    }

}


spinalCore.register_models([SpinalPilot]);
export { SpinalPilot };
export default SpinalPilot;