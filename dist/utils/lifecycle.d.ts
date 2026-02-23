import { IConnectorInfo } from "../interfaces";
import { SpinalOrganModel } from "../models";
import * as pm2 from "pm2";
export declare function getOrganConfig(spinalConnection: spinal.FileSystem, filePath: string): Promise<SpinalOrganModel | null>;
export declare function createOrganConfigFile(spinalConnection: spinal.FileSystem, organInfo: IConnectorInfo): Promise<SpinalOrganModel>;
export declare function getPm2Instance(name: string): Promise<pm2.ProcessDescription | undefined>;
