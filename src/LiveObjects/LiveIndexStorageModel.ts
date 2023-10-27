import { LiveMap, LiveObject } from "@liveblocks/client"
import { ILiveIndexNode, LiveIndexNode } from "./LiveIndexNode.js"
import { TreeNodeType } from "../AirNodeTypes/defineAirNodeType.js"


export type ILiveIndexStorageModel = {
    liveIndex: LiveMap<string, ILiveIndexNode>
}

export class LiveIndexStorageModel implements ILiveIndexStorageModel{
    liveIndex: LiveMap<string, ILiveIndexNode>
    constructor(schema: TreeNodeType) {
        this.liveIndex = new LiveMap([['root', new LiveIndexNode({
                nodeId: 'root',
                type: 'root',
                parentNodeId: null,
                parentType: null,
                childNodeSets: new LiveMap(schema.children.map(child => 
                    [child.type, new LiveMap<string, null>()]
                )),
                state: new LiveObject({})
            })
        ]])
    }
}