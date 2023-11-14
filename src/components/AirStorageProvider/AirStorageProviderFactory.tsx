import { ReactNode, Suspense } from "react"
import { LiveIndexStorageModel, LiveblocksHooks } from "../../LiveObjects/LiveIndexStorageModel.js"
import { FlatAirNode } from "../../types.js"
import { JsonObject } from "@liveblocks/client"

export const AirStorageProviderFactory = <
    U extends FlatAirNode,
>(
    LiveblocksRoomProvider: LiveblocksHooks<U>['RoomProvider'],
    initialLiveblocksPresence: JsonObject
) => ({
    storageId, 
    children
}: {
    storageId: string,
    children: ReactNode
}) => {
    return <LiveblocksRoomProvider
        id={storageId}
        initialPresence={{
            ...initialLiveblocksPresence,
            nodeKeySelection: [],
            focusedNodeKey: null
        }}
        initialStorage={new LiveIndexStorageModel()}
    >
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    </LiveblocksRoomProvider>
}