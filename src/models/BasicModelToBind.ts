import { Lst, Model, Ptr, spinalCore } from "spinal-core-connectorjs";
import * as lodash from "lodash";

class BasicModelToBind<T extends Model> extends Model {

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

    /**
     * Adds a new model to the internal list and updates the length property.
     *
     * @param model - The model instance to add to the list.
     * @returns A promise that resolves to the new length of the list after the model is added.
     */
    public async addModel(model: T): Promise<number> {
        const dataList = await this.getList();
        dataList.push(model);
        this.length = dataList.length;
        this._debounceChange();
        return this.length;
    }


    /**
     * Removes the specified model from the internal list.
     *
     * @param model - The model instance to be removed.
     * @returns A promise that resolves to the new length of the list after removal.
     * @throws May throw if the underlying list retrieval or removal fails.
     */
    public async removeModel(model: T): Promise<number> {
        const dataList = await this.getList();
        dataList.remove(model);
        this.length = dataList.length;
        return this.length;
    }


    /**
     * Asynchronously retrieves a list of items of type `T`.
     *
     * @returns {Promise<Lst<T>>} A promise that resolves with the loaded list of items.
     */
    public async getList(): Promise<Lst<T>> {
        return new Promise((resolve) => {
            this.data.load((discoverList) => resolve(discoverList));
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
    public async consumeModels(): Promise<T[]> {
        const dataList = await this.getList();
        const arr: T[] = Array.from(dataList);

        this.length.set(0);
        dataList.clear();

        return arr;
    }


    /**
     * Registers a callback function to be invoked whenever the `modification_date` changes.
     * The callback receives an updated array of models of type `T`.
     *
     * @param callback - A function that will be called with the updated list of models (`T[]`) whenever a change is detected.
     */
    public listenToChange(callback: (models: T[]) => void): void {
        this.modification_date.bind(async () => {
            const dataList = await this.getList();
            const arr: T[] = Array.from(dataList);
            callback(arr);
        })
    }
}

spinalCore.register_models([BasicModelToBind]);
export default BasicModelToBind;
export { BasicModelToBind };