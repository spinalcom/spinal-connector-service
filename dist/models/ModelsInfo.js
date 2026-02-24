"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelsInfo = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const lodash = require("lodash");
class ModelsInfo extends spinal_core_connectorjs_1.Model {
    constructor() {
        super();
        this.add_attr({
            modification_date: Date.now(),
            length: 0,
            data: new spinal_core_connectorjs_1.Ptr(new spinal_core_connectorjs_1.Lst())
        });
        this._debounceChange = lodash.debounce(() => this.modification_date.set(Date.now()), 1000);
    }
    /**
     * Adds a new model to the internal list and updates the length property.
     *
     * @param model - The model instance to add to the list.
     * @returns A promise that resolves to the new length of the list after the model is added.
     */
    addModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = yield this.getList();
            dataList.push(model);
            this.length = dataList.length;
            this._debounceChange();
            return this.length;
        });
    }
    /**
     * Removes the specified model from the internal list.
     *
     * @param model - The model instance to be removed.
     * @returns A promise that resolves to the new length of the list after removal.
     * @throws May throw if the underlying list retrieval or removal fails.
     */
    removeModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = yield this.getList();
            dataList.remove(model);
            this.length = dataList.length;
            return this.length;
        });
    }
    /**
     * Asynchronously retrieves a list of items of type `T`.
     *
     * @returns {Promise<Lst<T>>} A promise that resolves with the loaded list of items.
     */
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.data.load((discoverList) => resolve(discoverList));
            });
        });
    }
    /**
     * Consumes and returns all models currently in the list.
     *
     * This method retrieves the current list of models, converts it to an array,
     * resets the internal length to zero, and clears the list to indicate that
     * the models have been consumed. The returned array contains all models that
     * were present before the list was cleared.
     *
     * @returns {Promise<T[]>} A promise that resolves to an array of models of type `T`.
     */
    consumeModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = yield this.getList();
            const arr = Array.from(dataList);
            this.length.set(0);
            dataList.clear();
            return arr;
        });
    }
    /**
     * Registers a callback function to be invoked whenever the `modification_date` changes.
     * The callback receives an updated array of models of type `T`.
     *
     * @param callback - A function that will be called with the updated list of models (`T[]`) whenever a change is detected.
     */
    listenToChange(callback) {
        this.modification_date.bind(() => __awaiter(this, void 0, void 0, function* () {
            const dataList = yield this.getList();
            const arr = Array.from(dataList);
            callback(arr);
        }));
    }
}
exports.ModelsInfo = ModelsInfo;
spinal_core_connectorjs_1.spinalCore.register_models([ModelsInfo]);
exports.default = ModelsInfo;
//# sourceMappingURL=ModelsInfo.js.map