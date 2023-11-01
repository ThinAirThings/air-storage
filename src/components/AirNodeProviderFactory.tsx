import { ReactNode, Suspense } from "react"
import { LiveIndexStorageModel, LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js"
import { createRoomContext } from "@liveblocks/react"
import { TreeAirNode } from "../types.js"


export const AirNodeProviderFactory = (
    rootAirNode: TreeAirNode,
    LiveblocksRoomProvider: LiveblocksHooks['RoomProvider'],
    initialLiveblocksPresence: Record<string, any>
) => ({
    storageId, 
    children
}: {
    storageId: string,
    children: ReactNode
}) => {
    return <LiveblocksRoomProvider
        id={storageId}
        initialPresence={initialLiveblocksPresence}
        initialStorage={new LiveIndexStorageModel(rootAirNode)}
    >
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    </LiveblocksRoomProvider>
}