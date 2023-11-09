import { createRoomContext } from "@liveblocks/react";
import { FlatAirNode, TreeAirNode, TreeToNodeUnion } from "./types.js";
import { MappedUnion } from "./types/MappedUnion.js";
import { ILiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js";
import { JsonObject, createClient } from "@liveblocks/client";
import { NodeKey, createNodeKey } from "./types/NodeKey.js";
import { AirNodeProviderFactory } from "./components/AirNodeProviderFactory.js";
import { useCreateNodeFactory } from "./hooks/useCreateNodeFactory.js";
import { useDeleteNodeFactory } from "./hooks/useDeleteNodeFactory.js";
import { useSelectNodeStateFactory } from "./hooks/useSelectNodeStateFactory.js";
import { useUpdateNodeStateFactory } from "./hooks/useUpdateNodeStateFactory.js";
import { treeToStructureIndex } from "./extendAirNodeDefinition.js";
import { useNodeSetFactory } from "./hooks/useNodeSetFactory.js";
import { useUniversalNodeSetFactory } from "./hooks/useUniversalNodeSetFactory.js";
import { useChildNodeKeySetFactory } from "./hooks/useChildNodeKeySetFactory.js";

export const configureAirStorage = <
    U extends FlatAirNode,
    StaticIndex extends Record<string, any>,
    LiveblocksPresence extends JsonObject={},
>(
    createClientProps: Parameters<typeof createClient>[0],
    rootAirNode: TreeAirNode,
    liveblocksPresence?: LiveblocksPresence
) => {
    const mappedAirNodeUnion = treeToMappedUnion(rootAirNode)
    const StaticIndex = treeToStructureIndex(rootAirNode) as StaticIndex
    const {suspense: {
        useStorage,
        useMutation,
        RoomProvider,
        useUpdateMyPresence,
        useSelf
    }} = createRoomContext<
        LiveblocksPresence, 
        ILiveIndexStorageModel<U>
    >(createClient(createClientProps))

    return {
        // Liveblocks Hooks
        useUpdateMyPresence,
        useSelf,
        // Air Hooks
        useNodeSet: useNodeSetFactory<U>(useStorage),
        useUniversalNodeSet: useUniversalNodeSetFactory<U>(useStorage),
        useCreateNode: useCreateNodeFactory<U>(useMutation, mappedAirNodeUnion),
        useSelectNodeState: useSelectNodeStateFactory<U>(useStorage),
        useUpdateNodeState: useUpdateNodeStateFactory<U>(useMutation),
        useDeleteNode: useDeleteNodeFactory<U>(useMutation),
        useChildNodeKeySet: useChildNodeKeySetFactory<U>(useStorage),
        AirNodeProvider: AirNodeProviderFactory(rootAirNode, RoomProvider, liveblocksPresence??{}),
        // Only use 'useStorage' here because Liveblocks will throw an error if useStorage isn't called before using mutations.
        useRootAirNode: () => useStorage(()=>createNodeKey('root', 'root')),
        StaticIndex
    }
}

// Remember, this is a generic internal function, so use generic product types.
const treeToMappedUnion = (
    tree: TreeAirNode
): MappedUnion<FlatAirNode> => {
    const treeToUnionMap = (map: MappedUnion<TreeToNodeUnion<TreeAirNode>>, tree: TreeAirNode): MappedUnion<FlatAirNode> => {
        map.set(tree.type, {
            type: tree.type,
            state: tree.state,
            childTypeSet: new Set(tree.children.map(child => child.type))
        })
        tree.children.forEach(child => treeToUnionMap(map, child))
        return map
    }
    return treeToUnionMap(new MappedUnion([]), tree)
}