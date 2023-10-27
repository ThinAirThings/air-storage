import { JsonObject, createClient } from "@liveblocks/client"
import { AirNodeType, StaticTreeNodeType, TreeNodeType } from "./AirNodeTypes/defineAirNodeType.js"
import { createRoomContext } from "@liveblocks/react"
import { ILiveIndexStorageModel, LiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js"
import { LiveblocksHooks, createFunctionSet } from "./createFunctionSet.js"
import { useAirGraphFactory } from "./hooks/useAirGraph.js"


export type StaticNodeIndex<U extends AirNodeType> = Map<U['type'], {
    type: U['type'],
    functionSet: ReturnType<typeof createFunctionSet<U, U['type']>>,
}>

export const configureAirStorage = <
    LiveblocksPresence extends JsonObject,
    U extends AirNodeType
>(
    liveblocksPresence: LiveblocksPresence,
    createClientProps: Parameters<typeof createClient>[0],
    schema: TreeNodeType
) => {
    
    // Create Liveblocks Client 
    const liveblocksClient = createClient(createClientProps)
    // Setup Liveblocks room context
    const {suspense: liveblocks} = createRoomContext<
        LiveblocksPresence,
        ILiveIndexStorageModel
    >(liveblocksClient)
    // Create Static Index of AirNodes
    const StaticIndex: StaticNodeIndex<U> = treeToIndex<U>(new Map(), liveblocks, schema as StaticTreeNodeType)

    const AirStorageProvider = ({
        storageId,
        children
    }: {
        storageId: string,
        children: React.ReactNode
    }) => {
        return <liveblocks.RoomProvider
            id={storageId}
            initialPresence={liveblocksPresence}
            initialStorage={new LiveIndexStorageModel(schema)}
        >
            {children}
        </liveblocks.RoomProvider>
    }

    return {
        useAirGraph: useAirGraphFactory<U>(StaticIndex)
    }
}

const treeToIndex = <U extends AirNodeType>(
    staticIndex: StaticNodeIndex<U>,
    liveblocksHooks: LiveblocksHooks,
    treeNode: StaticTreeNodeType
): StaticNodeIndex<U>=> {
    const childTypeSet = new Set(treeNode.children.map(child => child.type))
    staticIndex.set(treeNode.type, {
        type: treeNode.type,
        functionSet: createFunctionSet(
            treeNode.state, 
            treeNode.functionSetBuilder as any,
            liveblocksHooks,
            childTypeSet
        ),
    })
    treeNode.children.forEach(child => treeToIndex(staticIndex, liveblocksHooks, child as StaticTreeNodeType))
    return staticIndex
}