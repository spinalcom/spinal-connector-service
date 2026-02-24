import { ProcessDescription } from "pm2";
import { IConnectorCreation, IConnectorInfo } from "../interfaces";
import { SpinalOrganModel } from "../models";
/**
 * Singleton service class responsible for managing the lifecycle and configuration
 * of a Spinal Organ within the SpinalCom ecosystem.
 *
 * The `SpinalConnectorService` handles initialization, configuration file management,
 * PM2 process instance retrieval and restart logic, and provides access to the
 * current organ configuration.
 *
 * @remarks
 * - Use `SpinalConnectorService.getInstance()` to obtain the singleton instance.
 * - The service ensures that the organ configuration file exists and is loaded,
 *   and provides utility methods to interact with the organ's PM2 process.
 *
 * @example
 * ```typescript
 * const connectorService = SpinalConnectorService.getInstance();
 * await connectorService.initialize(connect, organInfo);
 * ```
 *
 * @public
 */
declare class SpinalConnectorService {
    private static _instance;
    private _organInfo;
    organConfigModel: SpinalOrganModel | null;
    private constructor();
    static getInstance(): SpinalConnectorService;
    initialize(connect: spinal.FileSystem, organInfo: IConnectorInfo): Promise<IConnectorCreation>;
    getOrganConfig(): SpinalOrganModel | null;
    checkIfItsSameOrgan(organId: string): boolean;
    getPm2Instance(): Promise<ProcessDescription | undefined>;
    _bindRestart(): void;
    private _restartPm2Instance;
}
export default SpinalConnectorService;
export { SpinalConnectorService };
