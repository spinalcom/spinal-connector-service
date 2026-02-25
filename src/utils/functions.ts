/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */


import { FileSystem } from 'spinal-core-connectorjs_type';
import axiosRetry from 'axios-retry';
import axios from "axios";

const Q = require('q');

export function waitModelReady(): Promise<void> {
    return new Promise((resolve) => {
        const wait = () => {
            if (!FileSystem._sig_server) {
                setTimeout(wait, 200);
            } else {
                resolve();
            }
        };

        wait();
    });
}



export function guid(name: string): string {
    return `${name}-${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}-${Date.now().toString(16)}`;
}


export function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}


export function getPathData(dynamicId: number, hubUrl: string = "") {
    const path = `${hubUrl}/sceen/_?u=${dynamicId}`;
    const client = axios.create({ baseURL: hubUrl });
    axiosRetry(client, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
    return client.get(path, { responseType: 'arraybuffer' }).then((response) => {
        // return Buffer.from(response.data);
        return new Uint8Array(response.data);
    });
}


export function loadPtr(ptr: spinal.Ptr | spinal.Pbr): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            ptr.load((data) => resolve(data));
        } catch (error) {
            reject(error);
        }
    });
}