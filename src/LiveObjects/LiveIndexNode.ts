import { LiveMap, LiveObject, LsonObject } from "@liveblocks/client";
import { FlatAirNode } from "../types.js";



export type ILiveIndexNode<
    U extends FlatAirNode=FlatAirNode,
> = LiveObject<{
    nodeId: string
    type: U['type']
    parentNodeId: string | null
    parentType: string | null
    state: LiveObject<U['state']>
    childNodeSets: LiveMap<
        U['childTypeSet'] extends Set<infer T extends string> ? T : never, 
        LiveMap<string, null>
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
        childNodeSets: LiveMap<
            U['childTypeSet'] extends Set<infer T extends string> ? T : never, 
            LiveMap<string, null>
        >
        state: LiveObject<U['state']>
    }) {
        super(data)
    }
}