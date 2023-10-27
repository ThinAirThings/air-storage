import { LiveMap, LiveObject, LsonObject } from "@liveblocks/client";


export type ILiveIndexNode<State extends LsonObject=LsonObject> = LiveObject<{
    nodeId: string
    type: string
    parentNodeId: string | null
    parentType: string | null
    state: LiveObject<State>
    childNodeSets: LiveMap<string, LiveMap<string, null>>
}>

export class LiveIndexNode<State extends LsonObject=LsonObject> extends LiveObject<
    ILiveIndexNode<State> extends LiveObject<infer T>? T : never
> {
    constructor(data: {
        nodeId: string
        type: string
        parentNodeId: string | null
        parentType: string | null
        childNodeSets: LiveMap<string, LiveMap<string, null>>
        state: LiveObject<State>
    }) {
        super(data)
    }
}
