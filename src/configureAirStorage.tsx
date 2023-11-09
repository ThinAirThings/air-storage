import { createRoomContext } from "@liveblocks/react";
import { AirPresence, FlatAirNode, TreeAirNode, TreeToNodeUnion } from "./types.js";
import { MappedUnion } from "./types/MappedUnion.js";
import { ILiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js";
import { JsonObject, createClient } from "@liveblocks/client";
import { AirNodeProviderFactory } from "./components/AirNodeProviderFactory.js";
import { useCreateNodeFactory } from "./hooks-storage/useCreateNodeFactory.js";
import { useDeleteNodeFactory } from "./hooks-storage/useDeleteNodeFactory.js";
import { useSelectNodeStateFactory } from "./hooks-storage/useSelectNodeStateFactory.js";
import { useUpdateNodeStateFactory } from "./hooks-storage/useUpdateNodeStateFactory.js";
import { treeToStructureIndex } from "./extendAirNodeDefinition.js";
import { useNodeSetFactory } from "./hooks-storage/useNodeSetFactory.js";
import { useSelfNodeKeySelectionUpdateFactory } from "./hooks-presence/useSelfNodeKeySelectionUpdateFactory.js";
import { useSelfNodeKeySelectionFactory } from "./hooks-presence/useSelfNodeKeySelectionFactory.js";
import { useSelfNodeKeySelectionRemoveFactory } from "./hooks-presence/useSelfNodeKeySelectionRemoveFactory.js";
import { useSelfNodeKeySelectionAddFactory } from "./hooks-presence/useSelfNodeKeySelectionAddFactory.js";
import { useSelfFocusedNodeKeyFactory } from "./hooks-presence/useSelfFocusedNodeKeyFactory.js";
import { useSelfFocusedNodeKeyUpdateFactory } from "./hooks-presence/useSelfFocusedNodeKeyUpdateFactory.js";


export const configureAirStorage = <
    U extends FlatAirNode,
    StaticIndex extends Record<string, any>,
    P extends JsonObject={},
>(
    createClientProps: Parameters<typeof createClient>[0],
    rootAirNode: TreeAirNode,
    liveblocksPresence?: P
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
        AirPresence<U>, 
        ILiveIndexStorageModel<U>
    >(createClient(createClientProps))

    // NodeKey Selection Hooks
    const useSelfNodeKeySelection = useSelfNodeKeySelectionFactory<U>(
        useSelf
    )
    const useSelfNodeKeySelectionUpdate = useSelfNodeKeySelectionUpdateFactory<U>(
        useUpdateMyPresence,
        useSelfNodeKeySelection
    )
    const useSelfNodeKeySelectionAdd = useSelfNodeKeySelectionAddFactory<U>(
        useUpdateMyPresence,
        useSelfNodeKeySelection
    )
    const useSelfNodeKeySelectionRemove = useSelfNodeKeySelectionRemoveFactory<U>(
        useUpdateMyPresence,
        useSelfNodeKeySelection
    )
    // NodeKey Focus Hooks
    const useSelfFocusedNodeKey = useSelfFocusedNodeKeyFactory<U>(
        useSelf
    )
    // This is just keeps the internal typings clean
    type TypedLiveblocksHooks = ReturnType<
        typeof createRoomContext<
            AirPresence<U>&P, 
            ILiveIndexStorageModel<U>
        >
    >['suspense']
    return {
        // Liveblocks Hooks
        useUpdateMyPresence: useUpdateMyPresence as TypedLiveblocksHooks['useUpdateMyPresence'],
        useSelf: useSelf as TypedLiveblocksHooks['useSelf'],
        // Air Storage Hooks
        useNodeSet: useNodeSetFactory<U>(useStorage),
        useCreateNode: useCreateNodeFactory<U>(useMutation, mappedAirNodeUnion),
        useSelectNodeState: useSelectNodeStateFactory<U>(useStorage),
        useUpdateNodeState: useUpdateNodeStateFactory<U>(useMutation),
        useDeleteNode: useDeleteNodeFactory<U>(useMutation, useSelfNodeKeySelectionRemove),
        AirNodeProvider: AirNodeProviderFactory(rootAirNode, RoomProvider, liveblocksPresence??{}),
        // Air Presence NodeKeySelection Hooks
        useSelfNodeKeySelection,
        useSelfNodeKeySelectionUpdate,
        useSelfNodeKeySelectionAdd,
        useSelfNodeKeySelectionRemove,
        // Air Presence NodeKeyFocus Hooks
        useSelfFocusedNodeKey,
        useSelfFocusedNodeKeyUpdate: useSelfFocusedNodeKeyUpdateFactory<U>(
            useUpdateMyPresence,
            useSelfFocusedNodeKey
        ),
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
        })
        tree.children.forEach(child => treeToUnionMap(map, child))
        return map
    }
    return treeToUnionMap(new MappedUnion([]), tree)
}