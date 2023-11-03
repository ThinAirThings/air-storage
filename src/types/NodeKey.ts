


export class NodeKey<T extends string=string> {
    constructor(public nodeId: string, public type: T){}
}

export type INodeKey<T extends string=string> = {
    nodeId: string,
    type: T
}