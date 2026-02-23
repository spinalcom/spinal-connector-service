import { Model } from "spinal-core-connectorjs";
import { SpinalNode } from "spinal-env-viewer-graph-service";
declare class SpinalOrganModel extends Model {
    constructor(name?: string, type?: string);
    /**
     * Adds a reference to an organ SpinalNode for the specified context ID.
     * If a reference already exists for the given context ID, it is removed before adding the new one.
     *
     * @param contextId - The unique identifier for the context in which the reference is added.
     * @param spinalNode - The organ SpinalNode instance to be referenced.
     * @returns The organ SpinalNode that was added as a reference.
     */
    addReferences(contextId: string, spinalNode: SpinalNode): SpinalNode;
    /**
     * Checks if the current organ model is referenced within a specific context.
     *
     * @param contextId - The unique identifier of the context to check.
     * @returns `true` if the organ model is referenced in the given context; otherwise, `false`.
     */
    isReferencedInContext(contextId: string): boolean;
    /**
     * Removes the reference to the specified context ID from the organ model.
     *
     * If the organ model is currently referenced in the given context, this method
     * deletes the reference attribute associated with the provided context ID.
     *
     * @param contextId - The unique identifier of the context from which to remove the reference.
     */
    removeReferences(contextId: string): void;
}
export default SpinalOrganModel;
export { SpinalOrganModel };
