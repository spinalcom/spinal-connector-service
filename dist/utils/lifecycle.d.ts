import { IConnectorInfo } from "../interfaces";
import { SpinalOrganModel } from "../models";
export declare function getOrganConfig(spinalConnection: spinal.FileSystem, filePath: string): Promise<SpinalOrganModel | null>;
export declare function createOrganConfigFile(spinalConnection: spinal.FileSystem, organInfo: IConnectorInfo): Promise<SpinalOrganModel>;
