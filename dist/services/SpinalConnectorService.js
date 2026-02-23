"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalConnectorService = void 0;
const pm2_1 = require("pm2");
const constants_1 = require("../utils/constants");
const lifecycle_1 = require("../utils/lifecycle");
class SpinalConnectorService {
    constructor() {
        this._organInfo = null;
        this.organConfigModel = null;
    }
    static getInstance() {
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
    initialize(connect, organInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            this._organInfo = organInfo;
            if (!organInfo.path)
                organInfo.path = `${constants_1.DEFAULT_PATH}/${organInfo.name}.conf`;
            let alreadyExists = true;
            let organModel = yield (0, lifecycle_1.getOrganConfig)(connect, organInfo.path);
            if (!organModel) {
                alreadyExists = false;
                organModel = yield (0, lifecycle_1.createOrganConfigFile)(connect, organInfo);
            }
            this.organConfigModel = organModel;
            const instancePm2 = yield (0, lifecycle_1.getPm2Instance)(organInfo.name);
            return { alreadyExists, node: organModel, instancePm2 };
        });
    }
    /**
     * Retrieves the current organ configuration model.
     *
     * @returns The {@link SpinalOrganModel} instance representing the organ configuration,
     * or `null` if no configuration is available.
     */
    getOrganConfig() {
        return this.organConfigModel;
    }
    /**
     * Checks if the provided organ ID matches the ID of the current organ configuration model.
     *
     * @param organId - The ID of the organ to compare against the current organ configuration model.
     * @returns `true` if the organ IDs are the same; otherwise, `false`.
     */
    checkIfItsSameOrgan(organId) {
        if (!this.organConfigModel)
            return false;
        return this.organConfigModel.id.get() === organId;
    }
    /**
     * Retrieves the PM2 process instance associated with the current organ information.
     *
     * @returns A promise that resolves to a `ProcessDescription` object if the organ information is available,
     *          or `undefined` if it is not.
     */
    getPm2Instance() {
        var _a;
        if (!this._organInfo)
            return Promise.resolve(undefined);
        return (0, lifecycle_1.getPm2Instance)(((_a = this._organInfo) === null || _a === void 0 ? void 0 : _a.name) || '');
    }
    /**
     * Binds a listener to the `restart` property of the `organConfigModel`.
     * When the `restart` property is triggered and set to true, this method
     * initiates a restart of the PM2 instance`.
     * Note: This method should be called after the `organConfigModel` has been initialized and assigned.
     */
    _bindRestart() {
        var _a;
        if (!this._organInfo)
            return;
        (_a = this.organConfigModel) === null || _a === void 0 ? void 0 : _a.restart.bind(() => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const mustRestart = (_b = this.organConfigModel) === null || _b === void 0 ? void 0 : _b.restart.get();
            if (mustRestart)
                yield this._restartPm2Instance();
        }));
    }
    _restartPm2Instance() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this._organInfo)
                return;
            const pm2Instance = yield (0, lifecycle_1.getPm2Instance)(((_a = this._organInfo) === null || _a === void 0 ? void 0 : _a.name) || '');
            if (!pm2Instance)
                return resolve(false);
            const pm_id = pm2Instance.pm_id;
            (0, pm2_1.restart)(pm_id, (err) => {
                if (err)
                    return resolve(false);
                resolve(true);
            });
        }));
    }
}
exports.SpinalConnectorService = SpinalConnectorService;
SpinalConnectorService._instance = null;
exports.default = SpinalConnectorService;
//# sourceMappingURL=SpinalConnectorService.js.map