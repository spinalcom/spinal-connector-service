import * as lodash from "lodash";
import { EventEmitter } from "events";
import { QueueEvents } from "../utils/constants"


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
 */
export class SpinalQueue<T> extends EventEmitter {
    private processed: Array<T> = []; // List of processed items, used to calculate the percentage of completion
    private queueList: Array<T> = [];

    public percent: number = 0;
    public isProcessing: boolean = false;
    public startDebounce: number = 3000;

    private debounceStart: lodash.DebouncedFunc<() => void>;

    constructor(startDebounce: number = 3000) {
        super();
        this.startDebounce = startDebounce;

        this.debounceStart = lodash.debounce(this.start.bind(this), this.startDebounce);
    }

    public start() {
        if (!this.isProcessing) {
            this.isProcessing = true;
            this.emit(QueueEvents.START);
        }
    }

    /**
     * Adds one or more items to the queue and triggers debounced start.
     * 
     * @param {T | T[]} item - The item(s) to add to the queue.
     * @returns {number} The new length of the queue.
     */
    public addToQueue(item: T | T[]): number {
        if (!Array.isArray(item)) item = [item];

        this.queueList.push(...item);
        this.debounceStart();
        return this.queueList.length;
    }


    /**
     * Sets the queue with the provided array of items, clears the existing queue,
     * recalculates the processing percentage, and initiates the debounced start process.
     *
     * @param queue - An array of items of type `T` to set as the new queue.
     * @returns The length of the newly set queue.
     */
    public setQueue(queue: T[]): number {
        this.clear();
        this.queueList = queue;
        this.recalculatePercent(undefined);

        this.debounceStart();
        return this.queueList.length;
    }

    /**
     * Removes and returns the first item from the queue.
     * Also recalculates the percent based on the dequeued item.
     * If the queue becomes empty after the operation, triggers the finish process.
     *
     * @returns {T | undefined} The dequeued item, or `undefined` if the queue is empty.
     */
    public dequeue(): T | undefined {
        const item = this.queueList.shift();
        this.recalculatePercent(item);

        if (this.queueList.length === 0) this.finish();
        return item;
    }

    /**
     * Removes and returns the last item from the queue.
     * Recalculates the percent based on the popped item and
     * triggers the finish logic if the queue becomes empty.
     *
     * @returns {T | undefined} The last item in the queue, or `undefined` if the queue is empty.
     */
    public pop(): T | undefined {
        const item = this.queueList.pop();

        this.recalculatePercent(item);

        if (this.queueList.length === 0) this.finish();
        return item;
    }

    /**
     * Clears the queue by resetting the queue list, processed items, and percent completion.
     * Also calls the `finish` method to finalize the clearing process.
     */
    public clear() {
        this.queueList = [];
        this.processed = [];
        this.percent = 0;
        this.finish();
    }

    /**
     * Returns a shallow copy of the current queue as an array.
     *
     * @returns {T[]} An array containing the items in the queue.
     */
    public toArray(): T[] {
        return [...this.queueList];
    }

    /**
     * Checks whether the queue is empty.
     *
     * @returns {boolean} `true` if the queue contains no elements, otherwise `false`.
     */
    public isEmpty(): boolean {
        return this.queueList.length === 0;
    }

    public getQueue(): T[] {
        // deprecated, use toArray instead
        console.warn("getQueue is deprecated, use toArray instead");
        return this.toArray();
    }

    public refresh() {
        // deprecated, use clear instead
        console.warn("refresh is deprecated, use clear instead");
        this.clear();
    }


    private finish() {
        if (this.isProcessing) {
            this.isProcessing = false;
            this.emit(QueueEvents.FINISH);
        }
    }

    private recalculatePercent(item: T | undefined) {
        if (item) this.processed.push(item);
        const total = this.processed.length + this.queueList.length;

        if (total === 0) {
            this.percent = 0;
            return;
        }

        this.percent = Math.floor((100 * this.processed.length) / total);
    }
}

export default SpinalQueue;
