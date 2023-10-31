import { createRoomContext } from "@liveblocks/react";
import { FlatAirNode, TreeAirNode, TreeToUnion } from "./types.js";
import { MappedUnion } from "./types/MappedUnion.js";
import { ILiveIndexStorageModel, LiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js";
import { createClient } from "@liveblocks/client";
import { CrudUnion, useAirNodeFactory } from "./hooks/useAirNode/useAirNodeFactory.js";
import { ReactNode } from "react";
import { NodeKey } from "./hooks/useAirNode/NodeKey.js";

export const configureAirStorage = <
    U extends FlatAirNode,
>(
    createClientProps: Parameters<typeof createClient>[0],
    tree: TreeAirNode
) => {
    const mappedAirNodeUnion = treeToMappedUnion(tree)
    const {suspense: liveblocks} = createRoomContext<
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
        return <liveblocks.RoomProvider
            id={storageId}
            initialPresence={{}}
            initialStorage={new LiveIndexStorageModel(tree)}
        >
            {children}
        </liveblocks.RoomProvider>
    }
    const useAirNode = useAirNodeFactory<U>(
        liveblocks.useMutation,
        liveblocks.useStorage,
        mappedAirNodeUnion
    )
    const useRootAirNode = () => new NodeKey('root', 'root')
    return {
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