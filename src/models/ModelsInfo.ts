import { Lst, Model, Ptr, spinalCore } from "spinal-core-connectorjs";
import * as lodash from "lodash";

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
class ModelsInfo<T extends Model = any> extends Model {

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
        this.length.set(dataList.length);
        this._debounceChange();
        return this.length.get();
    }

    public async removeModel(model: T): Promise<number> {
        const dataList = await this.getList();
        dataList.remove(model);
        this.length.set(dataList.length);
        return this.length.get();
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