import { JsonObject, LiveMap, LiveObject, LsonObject } from "@liveblocks/client";
import {createRoomContext} from '@liveblocks/react'

export type LiveIndexStorageModel = {
    liveNodeMap: LiveMap<string, ILiveIndexNode>
}
type ChildTypeUnion = string
type ChildNodeId = string
export type ILiveIndexNode = LiveObject<{
    nodeId: string
    metadata: JsonObject
    type: string
    parentNodeId: string | null
    parentType: string | null
    state: LiveObject<LsonObject>
    childNodeIds: LiveMap<ChildTypeUnion, LiveMap<ChildNodeId, null>>
}>

export class LiveIndexNode extends LiveObject<
    ILiveIndexNode extends LiveObject<infer T>? T : never
> {
    constructor(data: {
        nodeId: string
        metadata: JsonObject
        type: string
        parentNodeId: string | null
        parentType: string | null
        childNodeIds: LiveMap<string, LiveMap<string, null>>
        state: LiveObject<LsonObject>
    }) {
        super(data)
    }
}

export type MutationHook = ReturnType<
    typeof createRoomContext<
        any,
        LiveIndexStorageModel
    >
>