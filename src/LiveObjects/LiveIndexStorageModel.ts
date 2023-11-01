import { LiveMap, LiveObject } from "@liveblocks/client"
import { ILiveIndexNode, LiveIndexNode } from "./LiveIndexNode.js"
import { TreeAirNode } from "../types.js"
import { createRoomContext } from "@liveblocks/react"


export type ILiveIndexStorageModel = {
    liveIndex: LiveMap<string, ILiveIndexNode>
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

export type LiveblocksHooks = ReturnType<typeof createRoomContext<any, ILiveIndexStorageModel>>['suspense']