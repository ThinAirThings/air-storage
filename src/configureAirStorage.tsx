import { createRoomContext } from "@liveblocks/react";
import { AirPresence, FlatAirNode, TreeAirNode, TreeToNodeUnion } from "./types.js";
import { MappedUnion } from "./types/MappedUnion.js";
import { ILiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js";
import { JsonObject, createClient } from "@liveblocks/client";
import { AirStorageProviderFactory } from "./components/AirStorageProviderFactory.js";
import { useCreateNodeFactory } from "./hooks-storage/useCreateNodeFactory.js";
import { useDeleteNodeFactory } from "./hooks-storage/useDeleteNodeFactory.js";
import { useSelectNodeStateFactory } from "./hooks-storage/useSelectNodeStateFactory.js";
import { useUpdateNodeStateFactory } from "./hooks-storage/useUpdateNodeStateFactory.js";
import { useNodeSetFactory } from "./hooks-storage/useNodeSetFactory.js";
import { useSelfNodeKeySelectionUpdateFactory } from "./hooks-presence/useSelfNodeKeySelectionUpdateFactory.js";
import { useSelfNodeKeySelectionFactory } from "./hooks-presence/useSelfNodeKeySelectionFactory.js";
import { useSelfNodeKeySelectionRemoveFactory } from "./hooks-presence/useSelfNodeKeySelectionRemoveFactory.js";
import { useSelfNodeKeySelectionAddFactory } from "./hooks-presence/useSelfNodeKeySelectionAddFactory.js";
import { useSelfFocusedNodeKeyFactory } from "./hooks-presence/useSelfFocusedNodeKeyFactory.js";
import { useSelfFocusedNodeKeyUpdateFactory } from "./hooks-presence/useSelfFocusedNodeKeyUpdateFactory.js";
import { defineStaticIndexFactory } from "./structures/defineStaticIndexFactory.js";
import { createNodeKeyFactory } from "./structures/createNodeKeyFactory.js";


export const configureAirStorage = <
    U extends FlatAirNode,
    P extends JsonObject={},
>(
    createClientProps: Parameters<typeof createClient>[0],
    airNodeSchema: TreeAirNode,
    liveblocksPresence?: P
) => {
    const mappedAirNodeUnion = treeToMappedUnion(airNodeSchema)
    const {suspense: {
        useStorage,
        useMutation,
        RoomProvider,
        useUpdateMyPresence,
        useSelf,
        useRoom,
        RoomContext,
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
    const useSelfFocusedNodeKeyUpdate = useSelfFocusedNodeKeyUpdateFactory<U>(
        useUpdateMyPresence,
        useSelfFocusedNodeKey,
        useSelfNodeKeySelectionAdd,
        useSelfNodeKeySelectionRemove
    )
    // This is just keeps the internal typings clean
    type TypedLiveblocksHooks = ReturnType<
        typeof createRoomContext<
            AirPresence<U>&P, 
            ILiveIndexStorageModel<U>
        >
    >['suspense']
    // Typed Structure Builders
    const createNodeKey = createNodeKeyFactory<U>()
    return {
        // Liveblocks Hooks
        useUpdateMyPresence: useUpdateMyPresence as TypedLiveblocksHooks['useUpdateMyPresence'],
        useSelf: useSelf as TypedLiveblocksHooks['useSelf'],
        useRoom,
        useStorage,
        RoomContext,
        // Air Storage Hooks
        useNodeSet: useNodeSetFactory<U>(useStorage),
        useCreateNode: useCreateNodeFactory<U>(
            useMutation, 
            useSelfFocusedNodeKeyUpdate,
            createNodeKey,
            mappedAirNodeUnion
        ),
        useSelectNodeState: useSelectNodeStateFactory<U>(useStorage),
        useUpdateNodeState: useUpdateNodeStateFactory<U>(useMutation),
        useDeleteNode: useDeleteNodeFactory<U>(useMutation, useSelfNodeKeySelectionRemove),
        AirStorageProvider: AirStorageProviderFactory<U>(
            RoomProvider as TypedLiveblocksHooks['RoomProvider'], 
            liveblocksPresence??{}
        ),
        // Air Presence NodeKeySelection Hooks
        useSelfNodeKeySelection,
        useSelfNodeKeySelectionUpdate,
        useSelfNodeKeySelectionAdd,
        useSelfNodeKeySelectionRemove,
        // Air Presence NodeKeyFocus Hooks
        useSelfFocusedNodeKey,
        useSelfFocusedNodeKeyUpdate,
        // Structure Builder Functions
        defineStaticIndex: defineStaticIndexFactory<U>(),
        createNodeKey
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