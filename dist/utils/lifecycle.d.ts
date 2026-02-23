import { IConnectorInfo } from "../interfaces";
import { SpinalOrganModel } from "../models";
import { ProcessDescription } from "pm2";
export declare function getOrganConfig(spinalConnection: spinal.FileSystem, filePath: string): Promise<SpinalOrganModel | null>;
export declare function createOrganConfigFile(spinalConnection: spinal.FileSystem, organInfo: IConnectorInfo): Promise<SpinalOrganModel>;
export declare function getPm2Instance(name: string): Promise<ProcessDescription | undefined>;
