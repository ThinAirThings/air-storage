import { LiveObject } from "@liveblocks/client";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { AirStorageMutationContext, FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";


export const useUpdateNodeStateFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks['useMutation']
) => <
    T extends U['type']
>(
    nodeKey: NodeKey<T>,
) => useMutation((
    {storage}: AirStorageMutationContext,
    callback: (liveIndexState: LiveObject<(U&{type: T})['state']> ) => void
)=>{
    callback(storage.get('liveIndex').get(nodeKey.nodeId)!.get('state'))
}, [nodeKey])