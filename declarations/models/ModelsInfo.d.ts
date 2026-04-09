import { Lst, Model } from "spinal-core-connectorjs";
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
declare class ModelsInfo<T extends Model = any> extends Model {
    private _debounceChange;
    constructor();
    addModel(model: T): Promise<number>;
    removeModel(model: T): Promise<number>;
    getList(): Promise<Lst<T>>;
    consumeModels(): Promise<T[]>;
    listenToChange(callback: (models: T[]) => void): void;
}
export default ModelsInfo;
export { ModelsInfo };
