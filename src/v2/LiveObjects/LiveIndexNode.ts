import { LiveMap, LiveObject, LsonObject } from "@liveblocks/client";


export type ILiveIndexNode<
    S extends LsonObject=LsonObject,
> = LiveObject<{
    nodeId: string
    type: string
    parentNodeId: string | null
    parentType: string | null
    state: LiveObject<S>
    childNodeSets: LiveMap<string, LiveMap<string, null>>
}>

export class LiveIndexNode<
    S extends LsonObject=LsonObject,
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