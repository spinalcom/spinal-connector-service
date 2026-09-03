import { IConnectorInfo } from "../interfaces";
import { SpinalListener, SpinalOrganModel } from "../models";
import { SpinalNode } from "spinal-model-graph";
export declare function getOrganConfig(spinalConnection: spinal.FileSystem, filePath: string): Promise<SpinalOrganModel | null>;
export declare function createOrganConfigFile(spinalConnection: spinal.FileSystem, organInfo: IConnectorInfo): Promise<SpinalOrganModel>;
export declare function getOrganDeviceNode(organ: SpinalOrganModel): Promise<{
    [contextId: string]: SpinalNode[];
}>;
export declare function findDevices(parentNode: SpinalNode): Promise<SpinalNode[]>;
export declare function getDeviceListener(devices: SpinalNode[]): Promise<SpinalListener[]>;
export declare function _compareDeviceListeners(listenerModels: SpinalListener[], deviceListeners: SpinalListener[]): Promise<{
    valid: boolean;
    message?: string;
}>;
