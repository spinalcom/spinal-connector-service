import { Lst, Model, Ptr, spinalCore } from "spinal-core-connectorjs";
import * as lodash from "lodash";

/**
 * A generic class for managing a list of models with change tracking and debounced modification date updates.
 *
 * @template T - The type of model managed by this class, extending the base `Model` class.
 * 
 * @extends Model
 *
 * @remarks
 * - Maintains a list of models and tracks the modification date.
 * - Provides methods to add, remove, and consume models asynchronously.
 * - Notifies listeners on changes with debounced updates to avoid excessive notifications.
 *
 * @example
 * ```typescript
 * const modelsInfo = new ModelsInfo<MyModel>();
 * await modelsInfo.addModel(new MyModel());
 * modelsInfo.listenToChange((models) => {
 *   console.log('Models changed:', models);
 * });
 * ```
 * 
 * @methods
 * - `addModel(model: T): Promise<number>` - Adds a model to the list and returns the new length.
 * - `removeModel(model: T): Promise<number>` - Removes a model from the list and returns the new length.
 * - `getList(): Promise<Lst<T>>` - Retrieves the list of models.
 * - `consumeModels(): Promise<T[]>` - Retrieves and clears the list of models, returning them as an array.
 * - `listenToChange(callback: (models: T[]) => void): void` - Registers a callback to be called when the models change.
 *
 * 
 */
class ModelsInfo<T extends Model> extends Model {

    private _debounceChange: lodash.DebouncedFunc<() => void>;

    constructor() {
        super();
        this.add_attr({
            modification_date: Date.now(),
            length: 0,
            data: new Ptr(new Lst<T>())
        })

        this._debounceChange = lodash.debounce(() => this.modification_date.set(Date.now()), 1000);
    }

    public async addModel(model: T): Promise<number> {
        const dataList = await this.getList();
        dataList.push(model);
        this.length = dataList.length;
        this._debounceChange();
        return this.length;
    }

    public async removeModel(model: T): Promise<number> {
        const dataList = await this.getList();
        dataList.remove(model);
        this.length = dataList.length;
        return this.length;
    }


    public async getList(): Promise<Lst<T>> {
        return new Promise((resolve) => {
            this.data.load((discoverList) => resolve(discoverList));
        });
    }

    public async consumeModels(): Promise<T[]> {
        const dataList = await this.getList();
        const arr: T[] = Array.from(dataList);

        this.length.set(0);
        dataList.clear();

        return arr;
    }

    public listenToChange(callback: (models: T[]) => void): void {
        this.modification_date.bind(async () => {
            const dataList = await this.getList();
            const arr: T[] = Array.from(dataList);
            callback(arr);
        })
    }
}

spinalCore.register_models([ModelsInfo]);
export default ModelsInfo;
export { ModelsInfo };