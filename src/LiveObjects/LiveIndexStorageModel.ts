import { LiveMap, LiveObject } from "@liveblocks/client"
import { ILiveIndexNode, LiveIndexNode } from "./LiveIndexNode.js"
import { FlatAirNode, TreeAirNode } from "../types.js"
import { createRoomContext } from "@liveblocks/react"


export type ILiveIndexStorageModel<U extends FlatAirNode=FlatAirNode> = {
    liveIndex: LiveMap<string, ILiveIndexNode<U>>
}
export class LiveIndexStorageModel implements ILiveIndexStorageModel{
    liveIndex: LiveMap<string, ILiveIndexNode>
    constructor(treeRoot: TreeAirNode) {
        this.liveIndex = new LiveMap([['root', new LiveIndexNode({
                nodeId: 'root',
                type: 'RootNode',
                parentNodeId: null,
                parentType: null,
                childNodeSets: new LiveMap(treeRoot.children.map(child => 
                    [child.type, new LiveMap<string, null>()]
                )),
                state: new LiveObject({})
            })
        ]])
    }
}

export type LiveblocksHooks<U extends FlatAirNode=FlatAirNode> = ReturnType<typeof createRoomContext<any, ILiveIndexStorageModel<U>>>['suspense']