import { ProcessDescription } from "pm2";
import { IConnectorCreation, IConnectorInfo } from "../interfaces";
import { SpinalOrganModel } from "../models";
declare class SpinalConnectorService {
    private static _instance;
    private _organInfo;
    organConfigModel: SpinalOrganModel | null;
    private constructor();
    static getInstance(): SpinalConnectorService;
    /**
     * Initialize the SpinalConnectorService by loading or creating the organ configuration file and checking for an existing PM2 instance.
     *
     * @param {spinal.FileSystem} connect
     * @param {IConnectorInfo} organInfo
     * @return {*}  {Promise<IConnectorCreation>}
     * @memberof SpinalConnectorService
     */
    initialize(connect: spinal.FileSystem, organInfo: IConnectorInfo): Promise<IConnectorCreation>;
    /**
     * Retrieves the current organ configuration model.
     *
     * @returns The {@link SpinalOrganModel} instance representing the organ configuration,
     * or `null` if no configuration is available.
     */
    getOrganConfig(): SpinalOrganModel | null;
    /**
     * Checks if the provided organ ID matches the ID of the current organ configuration model.
     *
     * @param organId - The ID of the organ to compare against the current organ configuration model.
     * @returns `true` if the organ IDs are the same; otherwise, `false`.
     */
    checkIfItsSameOrgan(organId: string): boolean;
    /**
     * Retrieves the PM2 process instance associated with the current organ information.
     *
     * @returns A promise that resolves to a `ProcessDescription` object if the organ information is available,
     *          or `undefined` if it is not.
     */
    getPm2Instance(): Promise<ProcessDescription | undefined>;
    /**
     * Binds a listener to the `restart` property of the `organConfigModel`.
     * When the `restart` property is triggered and set to true, this method
     * initiates a restart of the PM2 instance`.
     * Note: This method should be called after the `organConfigModel` has been initialized and assigned.
     */
    _bindRestart(): void;
    private _restartPm2Instance;
}
export default SpinalConnectorService;
export { SpinalConnectorService };
