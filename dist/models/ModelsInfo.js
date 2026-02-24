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
/**
 * Represents a generic container for managing a list of models with change tracking and debounced modification date updates.
 *
 * @typeParam T - The type of model managed by this container, extending the base `Model` class.
 *
 * @remarks
 * - The class maintains a list of models and tracks the modification date.
 * - It provides methods to add, remove, and consume models, as well as to listen for changes.
 * - The modification date is updated in a debounced manner to avoid excessive updates.
 *
 * @example
 * ```typescript
 * const modelsInfo = new ModelsInfo<MyModel>();
 * await modelsInfo.addModel(new MyModel());
 * modelsInfo.listenToChange((models) => {
 *   console.log('Models changed:', models);
 * });
 * ```
 */
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
    addModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = yield this.getList();
            dataList.push(model);
            this.length = dataList.length;
            this._debounceChange();
            return this.length;
        });
    }
    removeModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = yield this.getList();
            dataList.remove(model);
            this.length = dataList.length;
            return this.length;
        });
    }
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.data.load((discoverList) => resolve(discoverList));
            });
        });
    }
    consumeModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = yield this.getList();
            const arr = Array.from(dataList);
            this.length.set(0);
            dataList.clear();
            return arr;
        });
    }
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