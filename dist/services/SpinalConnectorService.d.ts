import { IConnectorCreation } from "../interfaces";
/**
 * This class is a service of spinalcom connector it allows to manage a connector
 * @param  {string} connectorName - connector name
 * @param  {string} connectorType? - connector type
 * @param  {string} path? - connector path
 */
export declare class SpinalConnectorService {
    private name;
    private type;
    private path;
    constructor(name: string, type?: string, path?: string);
    /**
     * This methods creates if not exists a connector config file.
     * @param  {any} spinalConnection
     * @param  {spinal.Model} element
     * @returns Promise
     */
    createOrganConfigFile(spinalConnection: any, element?: spinal.Model): Promise<IConnectorCreation>;
    getPm2Instance(): Promise<any>;
}
