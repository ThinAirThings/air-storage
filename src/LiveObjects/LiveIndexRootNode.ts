import { LiveMap, LiveObject } from "@liveblocks/client";
import { LiveIndexNode } from "./LiveIndexNode.js";



export class LiveIndexRootNode extends LiveIndexNode {
    constructor(){
        super({
            nodeId: 'root',
            metadata: {},
            uixNodeType: 'Root',
            type: 'Root',
            parentNodeId: null,
            parentType: null,
            stateDisplayKey: 'root',
            state: new LiveObject({}),
            childNodeIds: new LiveMap([]),
        })
    }
}