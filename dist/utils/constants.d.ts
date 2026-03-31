export declare const DEFAULT_ORGAN_TYPE = "SPINAL_ORGAN";
export declare const DEFAULT_PATH = "/etc/Organs";
export declare const CONTEXT_TO_ORGAN_RELATION = "hasBmsNetworkOrgan";
export declare const QueueEvents: {
    readonly FINISH: "finish";
    readonly START: "start";
};
export declare const STATES: {
    readonly initial: "initial";
    readonly readyToDiscover: "readyToDiscover";
    readonly discovering: "discovering";
    readonly discovered: "discovered";
    readonly readyToCreate: "readyToCreate";
    readonly creating: "creating";
    readonly created: "created";
    readonly error: "error";
    readonly timeout: "timeout";
    readonly cancelled: "cancelled";
    readonly pending: "pending";
    readonly stopped: "stopped";
};
export declare const PILOT_STATES: {
    readonly init: "init";
    readonly processing: "processing";
    readonly success: "success";
    readonly error: "error";
};
