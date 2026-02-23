import { SpinalOrganModel } from '../models';
import { ProcessDescription } from "pm2";
export interface IConnectorCreation {
    alreadyExists: boolean;
    node: SpinalOrganModel;
    instancePm2?: ProcessDescription;
}
