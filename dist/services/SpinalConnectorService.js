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
    getOrganConfig() {
        return this.organConfigModel;
    }
    checkIfItsSameOrgan(organId) {
        if (!this.organConfigModel)
            return false;
        return this.organConfigModel.id.get() === organId;
    }
    getPm2Instance() {
        var _a;
        if (!this._organInfo)
            return Promise.resolve(undefined);
        return (0, lifecycle_1.getPm2Instance)(((_a = this._organInfo) === null || _a === void 0 ? void 0 : _a.name) || '');
    }
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