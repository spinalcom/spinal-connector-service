import { SpinalOrganModel } from "../models";
export interface IConnectorInfo {
    name: string;
    type?: string;
    path?: string;
    model?: spinal.Model | SpinalOrganModel;
}
