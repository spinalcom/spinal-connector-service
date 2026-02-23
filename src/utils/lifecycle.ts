import { create } from "domain";
import { IConnectorCreation, IConnectorInfo } from "../interfaces";
import { SpinalOrganModel } from "../models";
import { DEFAULT_ORGAN_TYPE, DEFAULT_PATH } from "./constants";
import { File as SpinalFile } from "spinal-core-connectorjs";
import { ProcessDescription, list as pm2ProcessList } from "pm2";


export function getOrganConfig(spinalConnection: spinal.FileSystem, filePath: string): Promise<SpinalOrganModel | null> {
    return new Promise((resolve) => {
        const { folderPath, fileName } = getFileInfoByPath(filePath);

        spinalConnection.load_or_make_dir(`${folderPath}`, async (directory) => {
            for (let index = 0; index < directory.length; index++) {
                const element = directory[index];
                const elementName = element.name.get().toLowerCase();
                if (elementName === fileName.toLowerCase() || elementName === `${fileName}.conf`.toLowerCase()) {
                    const organ = await loadConfigModel(element);
                    return resolve(organ);
                }
            }
            resolve(null);
        });
    })
}

export function createOrganConfigFile(spinalConnection: spinal.FileSystem, organInfo: IConnectorInfo): Promise<SpinalOrganModel> {
    return new Promise((resolve, reject) => {
        if (!organInfo.name) return reject(new Error("Organ name is required"));

        if (!organInfo.type) organInfo.type = DEFAULT_ORGAN_TYPE;
        if (!organInfo.path) organInfo.path = `${DEFAULT_PATH}/${organInfo.name}`;
        if (!organInfo.model) organInfo.model = new SpinalOrganModel(organInfo.name, organInfo.type);

        const { folderPath, fileName } = getFileInfoByPath(organInfo.path);

        spinalConnection.load_or_make_dir(`${folderPath}`, (directory) => {
            const file = new SpinalFile(`${fileName}.conf`.toLowerCase(), organInfo.model, undefined);
            directory.push(file);
            return resolve(organInfo.model as SpinalOrganModel);
        });
    });


}

export function getPm2Instance(name: string): Promise<ProcessDescription | undefined> {
    return new Promise((resolve, reject) => {
        pm2ProcessList((err, apps) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            const instance = apps.find(app => app.name === name);
            resolve(instance);

        })
    });
}

function loadConfigModel(element: spinal.File): Promise<SpinalOrganModel> {
    return new Promise((resolve) => {
        element.load(organ => resolve(organ));
    })
}

function getFileInfoByPath(filePath: string): { folderPath: string, fileName: string } {
    const pathParts = filePath.split("/");
    const fileName = pathParts.pop() || "";
    const folderPath = pathParts.join("/");
    return { folderPath, fileName };
}