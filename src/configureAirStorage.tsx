import { createRoomContext } from "@liveblocks/react";
import { FlatAirNode, TreeAirNode, TreeToUnion } from "./types.js";
import { MappedUnion } from "./types/MappedUnion.js";
import { ILiveIndexStorageModel, LiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js";
import { LiveMap, LiveObject, createClient } from "@liveblocks/client";
import { CrudUnion, useAirNodeFactory } from "./hooks/useAirNode/useAirNodeFactory.js";
import { ReactNode, Suspense } from "react";
import { NodeKey } from "./hooks/useAirNode/NodeKey.js";

export const configureAirStorage = <
    U extends FlatAirNode,
>(
    createClientProps: Parameters<typeof createClient>[0],
    tree: TreeAirNode
) => {
    const mappedAirNodeUnion = treeToMappedUnion(tree)
    const {suspense: {
        useStorage,
        useMutation,
        useStatus,
        RoomProvider
    }} = createRoomContext<
        {}, 
        ILiveIndexStorageModel
    >(createClient(createClientProps))
    const AirNodeProvider = ({
        storageId, 
        children
    }: {
        storageId: string,
        children: ReactNode
    }) => {
        return <RoomProvider
            id={storageId}
            initialPresence={{}}
            initialStorage={new LiveIndexStorageModel(tree)}
        >
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </RoomProvider>
    }
    const useAirNode = useAirNodeFactory<U>(
        useMutation,
        useStorage,
        mappedAirNodeUnion
    )
    // Only use 'useStorage' here because Liveblocks will throw an error if useStorage isn't called before using mutations.
    const useRootAirNode = () => useStorage(()=>new NodeKey('root', 'root'))
    return {
        useMutation,
        useStatus,
        AirNodeProvider,
        useAirNode,
        useRootAirNode,
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