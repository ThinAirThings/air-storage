import { LiveObject } from "@liveblocks/client"
import { FlatAirNode } from "../../../types.js"
import { NodeKey } from "../NodeKey.js"
import { LiveblocksHooks } from "../../../LiveObjects/LiveIndexStorageModel.js"


export type AirNodeUpdate<
    U extends FlatAirNode=FlatAirNode,
    T extends U['type']=U['type'],
    S extends (U&{type: T})['state']=(U&{type: T})['state']
> = (callback: (liveIndexNode: LiveObject<S>) => void) => void

export const airNodeUpdateFactory = <
    U extends FlatAirNode=FlatAirNode, 
>(
    useMutation: LiveblocksHooks['useMutation'],
) => <
    T extends U['type']
>(
    nodeKey: NodeKey<T>, 
): AirNodeUpdate<U, T> => useMutation((
    {storage}, 
    callback: (liveIndexState: LiveObject<(U&{type: T})['state']> ) => void
) => {
    callback(storage.get('liveIndex').get(nodeKey.nodeId)!.get('state'))
}, [])