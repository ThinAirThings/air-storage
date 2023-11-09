import { JsonObject, LiveMap, LiveObject } from "@liveblocks/client"
import { ILiveIndexNode, LiveIndexNode } from "./LiveIndexNode.js"
import { AirPresence, FlatAirNode, TreeAirNode } from "../types.js"
import { createRoomContext } from "@liveblocks/react"


export type ILiveIndexStorageModel<U extends FlatAirNode=FlatAirNode> = {
    liveIndex: LiveMap<string, ILiveIndexNode<U>>
}
export class LiveIndexStorageModel<U extends FlatAirNode=FlatAirNode> implements ILiveIndexStorageModel<U>{
    liveIndex: LiveMap<string, ILiveIndexNode<U>>
    constructor() {
        this.liveIndex = new LiveMap()
    }
}

export type LiveblocksHooks<
    U extends FlatAirNode=FlatAirNode,
> = ReturnType<
    typeof createRoomContext<
        AirPresence<U>, 
        ILiveIndexStorageModel<U>
    >
>['suspense']