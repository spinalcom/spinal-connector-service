import { Model, Ptr, spinalCore } from "spinal-core-connectorjs";
import { DEFAULT_ORGAN_TYPE } from "../utils/constants";
import { v4 as uuidv4 } from "uuid";
import { SpinalNode } from "spinal-env-viewer-graph-service";


class SpinalOrganModel extends Model {

    constructor(name?: string, type: string = DEFAULT_ORGAN_TYPE) {
        super();

        if (!type || !name) return;
        this.add_attr({
            id: uuidv4(),
            name: name,
            type: type,
            references: {},
            restart: false,
        });
    }

    /**
     * Adds a reference to an organ SpinalNode for the specified context ID.
     * If a reference already exists for the given context ID, it is removed before adding the new one.
     *
     * @param contextId - The unique identifier for the context in which the reference is added.
     * @param spinalNode - The organ SpinalNode instance to be referenced.
     * @returns The organ SpinalNode that was added as a reference.
     */
    public addReferences(contextId: string, spinalNode: SpinalNode): SpinalNode {
        const refFound = this.references[contextId];
        if (refFound) this.references.rem_attr(contextId);

        this.references.add_attr({ [contextId]: new Ptr(spinalNode) });
        return spinalNode;
    }

    /**
     * Checks if the current organ model is referenced within a specific context.
     *
     * @param contextId - The unique identifier of the context to check.
     * @returns `true` if the organ model is referenced in the given context; otherwise, `false`.
     */
    public isReferencedInContext(contextId: string): boolean {
        return typeof this.references[contextId] !== "undefined";
    }

    /**
     * Removes the reference to the specified context ID from the organ model.
     *
     * If the organ model is currently referenced in the given context, this method
     * deletes the reference attribute associated with the provided context ID.
     *
     * @param contextId - The unique identifier of the context from which to remove the reference.
     */
    public removeReferences(contextId: string): void {
        if (this.isReferencedInContext(contextId)) this.references.rem_attr(contextId);
    }

}

spinalCore.register_models([SpinalOrganModel]);
export default SpinalOrganModel;
export { SpinalOrganModel };

