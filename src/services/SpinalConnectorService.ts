import { ProcessDescription, restart as pm2Restart } from "pm2";
import { IConnectorCreation, IConnectorInfo } from "../interfaces";
import { SpinalOrganModel } from "../models";
import { DEFAULT_PATH } from "../utils/constants";
import { createOrganConfigFile, getOrganConfig, getPm2Instance } from "../utils/lifecycle";


class SpinalConnectorService {
    private static _instance: SpinalConnectorService | null = null;
    private _organInfo: IConnectorInfo | null = null;
    public organConfigModel: SpinalOrganModel | null = null;

    private constructor() { }

    public static getInstance(): SpinalConnectorService {
        if (!this._instance) {
            this._instance = new SpinalConnectorService();
        }
        return this._instance;
    }


    /**
     * Initialize the SpinalConnectorService by loading or creating the organ configuration file and checking for an existing PM2 instance.
     *
     * @param {spinal.FileSystem} connect
     * @param {IConnectorInfo} organInfo
     * @return {*}  {Promise<IConnectorCreation>}
     * @memberof SpinalConnectorService
     */
    public async initialize(connect: spinal.FileSystem, organInfo: IConnectorInfo): Promise<IConnectorCreation> {

        this._organInfo = organInfo;

        if (!organInfo.path) organInfo.path = `${DEFAULT_PATH}/${organInfo.name}.conf`;

        let alreadyExists = true;
        let organModel = await getOrganConfig(connect, organInfo.path);

        if (!organModel) {
            alreadyExists = false;
            organModel = await createOrganConfigFile(connect, organInfo);
        }

        this.organConfigModel = organModel;


        const instancePm2 = await getPm2Instance(organInfo.name);

        return { alreadyExists, node: organModel, instancePm2 };
    }


    /**
     * Retrieves the current organ configuration model.
     *
     * @returns The {@link SpinalOrganModel} instance representing the organ configuration,
     * or `null` if no configuration is available.
     */
    public getOrganConfig(): SpinalOrganModel | null {
        return this.organConfigModel;
    }


    /**
     * Checks if the provided organ ID matches the ID of the current organ configuration model.
     *
     * @param organId - The ID of the organ to compare against the current organ configuration model.
     * @returns `true` if the organ IDs are the same; otherwise, `false`.
     */
    checkIfItsSameOrgan(organId: string): boolean {
        if (!this.organConfigModel) return false;
        return this.organConfigModel.id.get() === organId;
    }


    /**
     * Retrieves the PM2 process instance associated with the current organ information.
     *
     * @returns A promise that resolves to a `ProcessDescription` object if the organ information is available,
     *          or `undefined` if it is not.
     */
    public getPm2Instance(): Promise<ProcessDescription | undefined> {
        if (!this._organInfo) return Promise.resolve(undefined);
        return getPm2Instance(this._organInfo?.name || '');
    }

    /**
     * Binds a listener to the `restart` property of the `organConfigModel`.
     * When the `restart` property is triggered and set to true, this method
     * initiates a restart of the PM2 instance`.
     * Note: This method should be called after the `organConfigModel` has been initialized and assigned.
     */
    public _bindRestart() {
        if (!this._organInfo) return;
        this.organConfigModel?.restart.bind(async () => {
            const mustRestart = this.organConfigModel?.restart.get();
            if (mustRestart) await this._restartPm2Instance();
        });
    }


    private _restartPm2Instance(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!this._organInfo) return;
            const pm2Instance = await getPm2Instance(this._organInfo?.name || '');

            if (!pm2Instance) return resolve(false);
            const pm_id = pm2Instance.pm_id as any;

            pm2Restart(pm_id, (err) => {
                if (err) return resolve(false);
                resolve(true);
            });

        });
    }




}

export default SpinalConnectorService;
export { SpinalConnectorService };