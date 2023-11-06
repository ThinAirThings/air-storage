import { FlatAirNode } from "../types.js"



export const createNodeKey = <
    U extends FlatAirNode,
    T extends U['type']
>(nodeId: string, type: T): NodeKey<T> => ({
    nodeId,
    type
})

export type NodeKey<T extends string=string> = {
    nodeId: string,
    type: T
}