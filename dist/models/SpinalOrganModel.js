"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalOrganModel = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const constants_1 = require("../utils/constants");
const uuid_1 = require("uuid");
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
    addReferences(contextId, spinalNode) {
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
    removeReferences(contextId) {
        if (this.isReferencedInContext(contextId))
            this.references.rem_attr(contextId);
    }
}
exports.SpinalOrganModel = SpinalOrganModel;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalOrganModel]);
exports.default = SpinalOrganModel;
//# sourceMappingURL=SpinalOrganModel.js.map