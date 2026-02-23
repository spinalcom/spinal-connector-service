import { Lst, Model } from "spinal-core-connectorjs";
declare class BasicModelToBind<T extends Model> extends Model {
    private _debounceChange;
    constructor();
    /**
     * Adds a new model to the internal list and updates the length property.
     *
     * @param model - The model instance to add to the list.
     * @returns A promise that resolves to the new length of the list after the model is added.
     */
    addModel(model: T): Promise<number>;
    /**
     * Removes the specified model from the internal list.
     *
     * @param model - The model instance to be removed.
     * @returns A promise that resolves to the new length of the list after removal.
     * @throws May throw if the underlying list retrieval or removal fails.
     */
    removeModel(model: T): Promise<number>;
    /**
     * Asynchronously retrieves a list of items of type `T`.
     *
     * @returns {Promise<Lst<T>>} A promise that resolves with the loaded list of items.
     */
    getList(): Promise<Lst<T>>;
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
    consumeModels(): Promise<T[]>;
    /**
     * Registers a callback function to be invoked whenever the `modification_date` changes.
     * The callback receives an updated array of models of type `T`.
     *
     * @param callback - A function that will be called with the updated list of models (`T[]`) whenever a change is detected.
     */
    listenToChange(callback: (models: T[]) => void): void;
}
export default BasicModelToBind;
export { BasicModelToBind };
