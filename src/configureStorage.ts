import { AirNode, FlattenTree, TreeNode } from "./AirNodeTemplate/defineAirNodeType.js";
import {JsonObject, createClient, LiveMap} from '@liveblocks/client'
import { createRoomContext } from "@liveblocks/react"
import { LiveIndexNode, LiveIndexStorageModel } from "./LiveObjects/LiveIndexNode.js";
import { useCreateNodeFactory } from "./hooks/useCreateNodeFactory.js";

export const configureStorage = <
    LiveblocksPresence extends JsonObject,
    FlattenedSchema extends AirNode,
>(
    liveblocksPresence: LiveblocksPresence,
    createClientProps: Parameters<typeof createClient>[0],
    treeSchema: TreeNode
) => {
    const {
        suspense: liveblocks
    } = createRoomContext<
        LiveblocksPresence, {
            liveNodeIndex: LiveMap<string, LiveIndexNode>
        }>(createClient(createClientProps))
    return {
        useCreateNode: useCreateNodeFactory(

        )
    }
}
