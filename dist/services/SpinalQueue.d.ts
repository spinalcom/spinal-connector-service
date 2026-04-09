/// <reference types="node" />
import { EventEmitter } from "events";
/**
 * A generic queue class with event emitting capabilities and progress tracking.
 *
 * @template T The type of items stored in the queue.
 * @extends EventEmitter
 *
 * This class provides methods to add, remove, and process items in a queue,
 * while emitting events for queue start and finish. It also tracks the percentage
 * of processed items and supports debounced queue start.
 *
 * @property {number} percent - The percentage of processed items in the queue.
 * @property {boolean} isProcessing - Indicates if the queue is currently being processed.
 * @property {number} startDebounce - The debounce delay (in ms) before starting the queue.
 *
 *
 * @method start() - Starts processing the queue if not already in progress.
 * @method addToQueue(item: T | T[]) - Adds one or more items to the queue and triggers debounced start.
 * @method setQueue(queue: T[]) - Sets the queue with the provided array of items, clears the existing queue, recalculates the processing percentage, and initiates the debounced start process.
 * @method dequeue() - Removes and returns the first item from the queue, recalculates the percent, and triggers finish if the queue becomes empty.
 * @method pop() - Removes and returns the last item from the queue, recalculates the percent, and triggers finish if the queue becomes empty.
 * @method clear() - Clears the queue by resetting the queue list, processed items, and percent completion, and calls finish.
 * @method toArray() - Returns a shallow copy of the current queue as an array.
 * @method isEmpty() - Checks whether the queue is empty.
 * @method getQueue() - Deprecated method to get the queue, use toArray instead.
 * @method refresh() - Deprecated method to clear the queue, use clear instead.
 * @event QueueEvents.START - Emitted when the queue starts processing.
 * @event QueueEvents.FINISH - Emitted when the queue finishes processing.
 *
 * @example
 * const queue = new SpinalQueue<string>();
 * queue.on(QueueEvents.START, () => console.log("Queue started"));
 * queue.on(QueueEvents.FINISH, () => console.log("Queue finished"));
 * queue.addToQueue(["item1", "item2", "item3"]);
 * console.log(queue.percent); // Outputs the percentage of completion
 *
 */
export declare class SpinalQueue<T> extends EventEmitter {
    private processed;
    private queueList;
    percent: number;
    isProcessing: boolean;
    startDebounce: number;
    autoStart: boolean;
    private debounceStart;
    constructor(startDebounce?: number, autoStart?: boolean);
    get length(): number;
    start(): void;
    /**
     * Adds one or more items to the queue and triggers debounced start.
     *
     * @param {T | T[]} item - The item(s) to add to the queue.
     * @returns {number} The new length of the queue.
     */
    addToQueue(item: T | T[]): number;
    /**
     * Sets the queue with the provided array of items, clears the existing queue,
     * recalculates the processing percentage, and initiates the debounced start process.
     *
     * @param queue - An array of items of type `T` to set as the new queue.
     * @returns The length of the newly set queue.
     */
    setQueue(queue: T[]): number;
    /**
     * Removes and returns the first item from the queue.
     * Also recalculates the percent based on the dequeued item.
     * If the queue becomes empty after the operation, triggers the finish process.
     *
     * @returns {T | undefined} The dequeued item, or `undefined` if the queue is empty.
     */
    dequeue(): T | undefined;
    /**
     * Removes and returns the last item from the queue.
     * Recalculates the percent based on the popped item and
     * triggers the finish logic if the queue becomes empty.
     *
     * @returns {T | undefined} The last item in the queue, or `undefined` if the queue is empty.
     */
    pop(): T | undefined;
    /**
     * Clears the queue by resetting the queue list, processed items, and percent completion.
     * Also calls the `finish` method to finalize the clearing process.
     */
    clear(): void;
    /**
     * Returns a shallow copy of the current queue as an array.
     *
     * @returns {T[]} An array containing the items in the queue.
     */
    toArray(): T[];
    /**
     * Checks whether the queue is empty.
     *
     * @returns {boolean} `true` if the queue contains no elements, otherwise `false`.
     */
    isEmpty(): boolean;
    getQueue(): T[];
    refresh(): void;
    private finish;
    private recalculatePercent;
}
export default SpinalQueue;
