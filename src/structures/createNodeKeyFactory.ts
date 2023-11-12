import { FlatAirNode } from "../types.js";


export type NodeKey<
    U extends FlatAirNode=FlatAirNode,
    T extends U['type']=U['type']
> = {
    nodeId: string,
    type: T
}

export const createNodeKeyFactory = <
    U extends FlatAirNode,
>() => <
    T extends U['type']
>({nodeId, type}: {
    nodeId: string,
    type: T
}): NodeKey<U, T> => ({
    nodeId,
    type
})