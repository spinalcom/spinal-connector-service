import { SpinalConnector } from '../models';
export interface IConnectorCreation {
    alreadyExist: boolean;
    node: SpinalConnector<any>;
    instancePm2: any;
}
