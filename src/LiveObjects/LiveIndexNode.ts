import { LiveMap, LiveObject } from "@liveblocks/client";
import { AirNodeState } from "../types.js";


export type ILiveIndexNode<
    S extends AirNodeState=AirNodeState,
> = LiveObject<{
    nodeId: string
    type: string
    parentNodeId: string | null
    parentType: string | null
    state: LiveObject<S>
    childNodeSets: LiveMap<string, LiveMap<string, null>>
}>

export class LiveIndexNode<
    S extends AirNodeState=AirNodeState,
> extends LiveObject<
    ILiveIndexNode<S> extends LiveObject<infer T>? T : never
> {
    constructor(data: {
        nodeId: string
        type: string
        parentNodeId: string | null
        parentType: string | null
        childNodeSets: LiveMap<string, LiveMap<string, null>>
        state: LiveObject<S>
    }) {
        super(data)
    }
}