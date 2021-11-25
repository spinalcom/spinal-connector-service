import { SpinalNode } from "spinal-model-graph";
export default class SpinalConnector<Type extends spinal.Model> extends SpinalNode<Type> {
    constructor(name?: string, type?: string, element?: Type);
}
export { SpinalConnector };
