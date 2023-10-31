import { createRoomContext } from "@liveblocks/react";
import { FlatAirNode, TreeAirNode, TreeToUnion } from "./types.js";
import { MappedUnion } from "./types/MappedUnion.js";
import { ILiveIndexStorageModel, LiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js";
import { createClient } from "@liveblocks/client";
import { NodeKey } from "./hooks/useAirNode/NodeKey.js";
import { AirNodeProviderFactory } from "./components/AirNodeProviderFactory.js";
import { useChildrenKeysFactory } from "./hooks/customHooks/useChildrenKeysFactory.js";
import { useCreateNodeFactory } from "./hooks/customHooks/useCreateNodeFactory.js";
import { useDeleteNodeFactory } from "./hooks/customHooks/useDeleteNodeFactory.js";
import { useSelectNodeStateFactory } from "./hooks/customHooks/useSelectNodeFactory.js";
import { useNodeNameFactory } from "./hooks/customHooks/useNodeNameFactory.js";
import { useUpdateNodeStateFactory } from "./hooks/customHooks/useUpdateNodeStateFactory.js";


export const configureAirStorage = <
    U extends FlatAirNode,
>(
    createClientProps: Parameters<typeof createClient>[0],
    rootAirNode: TreeAirNode
) => {
    const mappedAirNodeUnion = treeToMappedUnion(rootAirNode)
    const {suspense: {
        useStorage,
        useMutation,
        RoomProvider
    }} = createRoomContext<
        {}, 
        ILiveIndexStorageModel
    >(createClient(createClientProps))

    return {
        useCreateNode: useCreateNodeFactory<U>(useMutation, mappedAirNodeUnion),
        useSelectNodeState: useSelectNodeStateFactory<U>(useStorage),
        useUpdateNodeState: useUpdateNodeStateFactory<U>(useMutation),
        useNodeName: useNodeNameFactory(useStorage),
        useDeleteNode: useDeleteNodeFactory<U>(useMutation),
        useChildrenKeys: useChildrenKeysFactory<U>(useStorage),
        AirNodeProvider: AirNodeProviderFactory(rootAirNode, RoomProvider),
        // Only use 'useStorage' here because Liveblocks will throw an error if useStorage isn't called before using mutations.
        useRootAirNode: () => useStorage(()=>new NodeKey('root', 'root')),
        mappedAirNodeUnion
    }
}

// Remember, this is a generic internal function, so use generic product types.
const treeToMappedUnion = (
    tree: TreeAirNode
): MappedUnion<FlatAirNode> => {
    const treeToUnionMap = (map: MappedUnion<TreeToUnion<TreeAirNode>>, tree: TreeAirNode): MappedUnion<FlatAirNode> => {
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