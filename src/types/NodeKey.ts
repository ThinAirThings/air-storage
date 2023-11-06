import { FlatAirNode } from "../types.js"



export const createNodeKey = <
    U extends FlatAirNode,
    T extends U['type']
>(nodeId: string, type: T): NodeKey<U, T> => ({
    nodeId,
    type
})

export type NodeKey<
    U extends FlatAirNode,
    T extends U['type']=U['type']
> = {
    nodeId: string,
    type: T
}