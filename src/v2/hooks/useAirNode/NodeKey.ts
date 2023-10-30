


export class NodeKey<T extends string=string> {
    constructor(public nodeId: string, public type: T){}
}