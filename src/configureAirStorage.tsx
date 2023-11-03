import { createRoomContext } from "@liveblocks/react";
import { FlatAirNode, TreeAirNode, TreeToNodeUnion } from "./types.js";
import { MappedUnion } from "./types/MappedUnion.js";
import { ILiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js";
import { JsonObject, createClient } from "@liveblocks/client";
import { NodeKey } from "./types/NodeKey.js";
import { AirNodeProviderFactory } from "./components/AirNodeProviderFactory.js";
import { useChildrenNodeKeysFactory } from "./hooks/useChildrenNodeKeysFactory.js";
import { useCreateNodeFactory } from "./hooks/useCreateNodeFactory.js";
import { useDeleteNodeFactory } from "./hooks/useDeleteNodeFactory.js";
import { useSelectNodeStateFactory } from "./hooks/useSelectNodeFactory.js";
import { useUpdateNodeStateFactory } from "./hooks/useUpdateNodeStateFactory.js";
import { treeToStructureIndex } from "./extendAirNodeDefinition.js";
import { useNodeUnionFactory } from "./hooks/useNodeUnionFactory.js";

export const configureAirStorage = <
    U extends FlatAirNode,
    ExtIndex extends Record<string, any>,
    LiveblocksPresence extends JsonObject={},
>(
    createClientProps: Parameters<typeof createClient>[0],
    rootAirNode: TreeAirNode,
    liveblocksPresence?: LiveblocksPresence
) => {
    const mappedAirNodeUnion = treeToMappedUnion(rootAirNode)
    const StructureIndex = treeToStructureIndex(rootAirNode) as ExtIndex
    const {suspense: {
        useStorage,
        useMutation,
        RoomProvider,
        useUpdateMyPresence,
        useSelf
    }} = createRoomContext<
        LiveblocksPresence, 
        ILiveIndexStorageModel
    >(createClient(createClientProps))

    return {
        // Liveblocks Hooks
        useUpdateMyPresence,
        useSelf,
        // Air Hooks
        useNodeUnion: useNodeUnionFactory<U>(useStorage),
        useCreateNode: useCreateNodeFactory<U, ExtIndex>(useMutation, mappedAirNodeUnion, StructureIndex),
        useSelectNodeState: useSelectNodeStateFactory<U, ExtIndex>(useStorage, StructureIndex),
        useUpdateNodeState: useUpdateNodeStateFactory<U, ExtIndex>(useMutation, StructureIndex),
        useDeleteNode: useDeleteNodeFactory<U, ExtIndex>(useMutation, StructureIndex),
        useChildrenNodeKeys: useChildrenNodeKeysFactory<U>(useStorage),
        AirNodeProvider: AirNodeProviderFactory(rootAirNode, RoomProvider, liveblocksPresence??{}),
        // Only use 'useStorage' here because Liveblocks will throw an error if useStorage isn't called before using mutations.
        useRootAirNode: () => useStorage(()=>new NodeKey('root', 'root')),
        StructureIndex
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