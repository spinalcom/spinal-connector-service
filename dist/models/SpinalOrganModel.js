"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalOrganModel = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const constants_1 = require("../utils/constants");
const uuid_1 = require("uuid");
const ModelsInfo_1 = require("./ModelsInfo");
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
class SpinalOrganModel extends spinal_core_connectorjs_1.Model {
    constructor(name, type = constants_1.DEFAULT_ORGAN_TYPE) {
        super();
        if (!type || !name)
            return;
        this.add_attr({
            id: (0, uuid_1.v4)(),
            name: name,
            type: type,
            references: {},
            restart: false,
            discover: new ModelsInfo_1.default(),
            pilot: new ModelsInfo_1.default(),
            listener: new ModelsInfo_1.default()
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
    addReference(contextId, spinalNode) {
        const refFound = this.references[contextId];
        if (refFound)
            this.references.rem_attr(contextId);
        this.references.add_attr({ [contextId]: new spinal_core_connectorjs_1.Ptr(spinalNode) });
        return spinalNode;
    }
    /**
     * Checks if the current organ model is referenced within a specific context.
     *
     * @param contextId - The unique identifier of the context to check.
     * @returns `true` if the organ model is referenced in the given context; otherwise, `false`.
     */
    isReferencedInContext(contextId) {
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
    removeReference(contextId) {
        if (this.isReferencedInContext(contextId))
            this.references.rem_attr(contextId);
    }
}
exports.SpinalOrganModel = SpinalOrganModel;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalOrganModel]);
exports.default = SpinalOrganModel;
//# sourceMappingURL=SpinalOrganModel.js.map