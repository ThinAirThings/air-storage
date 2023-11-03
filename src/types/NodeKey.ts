


export const createNodeKey = <T extends string=string>(nodeId: string, type: T): NodeKey<T> => ({
    nodeId,
    type
})

export type NodeKey<T extends string=string> = {
    nodeId: string,
    type: T
}