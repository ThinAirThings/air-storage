import { LiveMap, LiveObject, LsonObject } from "@liveblocks/client";
import { FlatAirNode } from "../types.js";
import { NodeKey } from '../types/NodeKey.js'


export type ILiveIndexNode<
    U extends FlatAirNode=FlatAirNode,
> = LiveObject<{
    nodeId: string
    type: U['type']
    parentNodeId: string | null
    parentType: string | null
    state: LiveObject<U['state']>
    childNodeKeyMap: LiveMap<
        string, 
        NodeKey<U&{type: U['childTypeSet']}>
    >
}>

export class LiveIndexNode<
    U extends FlatAirNode=FlatAirNode,
> extends LiveObject<
    ILiveIndexNode<U> extends LiveObject<infer U>? U : never
> {
    constructor(data: {
        nodeId: string
        type: U['type']
        parentNodeId: string | null
        parentType: string | null
        childNodeKeyMap: LiveMap<
            string, 
            NodeKey<U&{type: U['childTypeSet']}>
        >
        state: LiveObject<U['state']>
    }) {
        super(data)
    }
}