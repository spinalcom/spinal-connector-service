import { create } from "domain";
import { IConnectorCreation, IConnectorInfo } from "../interfaces";
import { SpinalListener, SpinalOrganModel } from "../models";
import { DEFAULT_ORGAN_TYPE, DEFAULT_PATH } from "./constants";
import { File as SpinalFile } from "spinal-core-connectorjs";
import { SpinalNode } from "spinal-model-graph";
import { SpinalBmsDevice, SpinalBmsNetwork } from "spinal-model-bmsnetwork";

// import * as pm2 from "pm2";

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
	});
}

export function createOrganConfigFile(spinalConnection: spinal.FileSystem, organInfo: IConnectorInfo): Promise<SpinalOrganModel> {
	return new Promise((resolve, reject) => {
		if (!organInfo.name) return reject(new Error("Organ name is required"));

		if (!organInfo.type) organInfo.type = DEFAULT_ORGAN_TYPE;
		if (!organInfo.path) organInfo.path = `${DEFAULT_PATH}/${organInfo.name}`;
		if (!organInfo.model) organInfo.model = new SpinalOrganModel(organInfo.name, organInfo.type);

		let { folderPath, fileName } = getFileInfoByPath(organInfo.path);
		if (fileName.toLowerCase().endsWith(".conf")) fileName = fileName.replace(/\.conf$/i, ""); // Remove .conf extension if present

		spinalConnection.load_or_make_dir(`${folderPath}`, async (directory) => {
			const file = new SpinalFile(`${fileName}.conf`.toLowerCase(), organInfo.model, undefined);
			directory.push(file);
			return resolve(organInfo.model as SpinalOrganModel);
		});
	});
}

export async function getOrganDeviceNode(organ: SpinalOrganModel): Promise<{ [contextId: string]: SpinalNode[] }> {
	const nodeRefs = await organ.getAllReferences();
	const promises = Object.keys(nodeRefs).map(async (contextId) => {
		const node = nodeRefs[contextId];
		const devices = await findDevices(node);
		return [contextId, devices] as [string, SpinalNode[]];
	});

	const results = await Promise.all(promises);
	return Object.fromEntries(results);
}

export async function findDevices(parentNode: SpinalNode): Promise<SpinalNode[]> {
	const relations = [SpinalBmsNetwork.relationName, SpinalBmsDevice.relationName];
	const queue: SpinalNode[] = [parentNode];
	const devices: SpinalNode[] = [];

	while (queue.length > 0) {
		const node = queue.shift()!;
		const children = await node.getChildren(relations);
		for (const child of children) {
			if (child.getType().get() === SpinalBmsDevice.nodeTypeName) {
				devices.push(child);
				continue;
			}

			queue.push(child);
		}
	}

	return devices;
}

export async function getDeviceListener(devices: SpinalNode[]): Promise<SpinalListener[]> {
	const obj = {} as { [deviceId: string]: SpinalListener };
	const promises = devices.map(async (device) => {
		const listener = await device.info.listener?.load();
		return listener as SpinalListener;
	});

	return Promise.all(promises).then((listeners) => listeners.filter((listener) => listener !== undefined));
}

export async function _compareDeviceListeners(listenerModels: SpinalListener[], deviceListeners: SpinalListener[]): Promise<{ valid: boolean; message?: string }> {
	if (listenerModels.length !== deviceListeners.length) {
		return { valid: false, message: "Listener models count does not match the number of device listeners" };
	}

	const listenersObj = listenerModels.reduce((acc, listener) => {
		const key = listener._server_id as number;
		acc[key] = listener;
		return acc;
	}, {});

	for (const listener of deviceListeners) {
		const key = listener._server_id as number;
		if (!listenersObj[key]) {
			return { valid: false, message: `Device listener with server ID ${key} does not have a corresponding listener model` };
		}
	}

	return { valid: true };
}

// export function getPm2Instance(name: string): Promise<pm2.ProcessDescription | undefined> {
//     return new Promise((resolve, reject) => {
//         pm2.connect((err) => {
//             if (err) return resolve(undefined);

//             pm2.list((err, apps) => {
//                 if (err) {
//                     return resolve(undefined);
//                 }
//                 const instance = apps.find(app => app.name === name);
//                 resolve(instance);
//             });
//         });

//     });
// }

function loadConfigModel(element: spinal.File): Promise<SpinalOrganModel> {
	return new Promise((resolve) => {
		element.load((organ) => resolve(organ));
	});
}

function getFileInfoByPath(filePath: string): { folderPath: string; fileName: string } {
	const pathParts = filePath.split("/");
	const fileName = pathParts.pop() || "";
	const folderPath = pathParts.join("/");
	return { folderPath, fileName };
}
