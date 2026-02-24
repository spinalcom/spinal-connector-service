import { Model } from "spinal-core-connectorjs";
import { SpinalNode } from "spinal-env-viewer-graph-service";
/**
 * Represents an Organ model within the Spinal framework, providing mechanisms to manage
 * references to SpinalNode instances across different contexts, as well as handling
 * discovery, pilot, and listener models.
 *
 * @template D - The type of data managed by the discovery model.
 * @template P - The type of data managed by the pilot model.
 * @template L - The type of data managed by the listener model.
 *
 * @extends Model
 *
 * @remarks
 * The SpinalOrganModel class is designed to encapsulate the logic for managing
 * organ nodes and their references within various contexts. It supports adding,
 * checking, and removing references to SpinalNode instances, and maintains
 * separate models for discovery, pilot, and listener functionalities.
 *
 * @example
 * ```typescript
 * const organ = new SpinalOrganModel('OrganName', 'OrganType');
 * organ.addReference('contextId', spinalNodeInstance);
 * if (organ.isReferencedInContext('contextId')) {
 *   // Do something
 * }
 * organ.removeReference('contextId');
 * ```
 */
declare class SpinalOrganModel<D extends Model = any, P extends Model = any, L extends Model = any> extends Model {
    constructor(name?: string, type?: string);
    /**
     * Adds a reference to an organ SpinalNode for the specified context ID.
     * If a reference already exists for the given context ID, it is removed before adding the new one.
     *
     * @param contextId - The unique identifier for the context in which the reference is added.
     * @param spinalNode - The organ SpinalNode instance to be referenced.
     * @returns The organ SpinalNode that was added as a reference.
     */
    addReference(contextId: string, spinalNode: SpinalNode): SpinalNode;
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
    removeReference(contextId: string): void;
}
export default SpinalOrganModel;
export { SpinalOrganModel };
