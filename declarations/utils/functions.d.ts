import { Path, Ptr } from "spinal-core-connectorjs_type";
export declare function waitModelReady(): Promise<void>;
export declare function guid(name: string): string;
export declare function s4(): string;
export declare function getPathData(path_ptr: Ptr<Path>, hubUrl?: string): Promise<Uint8Array>;
export declare function loadPtr(ptr: spinal.Ptr | spinal.Pbr): Promise<any>;
export declare function generateUniqueId(): string;
