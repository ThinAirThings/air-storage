import { LiveObject } from "@liveblocks/client";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { AirStorageMutationContext, FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";


export const useUpdateNodeStateFactory = <
    U extends FlatAirNode,
    ExtIndex extends Record<string, any>
>(
    useMutation: LiveblocksHooks['useMutation'],
    extensionIndex: ExtIndex
) => <
    T extends U['type']
>(
    nodeKey: NodeKey<U, T>,
) => useMutation((
    {storage}: AirStorageMutationContext,
    callback: (
        liveIndexState: LiveObject<(U&{type: T})['state']>,
        ext: ExtIndex[T]
    ) => void
)=>{
    callback(storage.get('liveIndex').get(nodeKey.nodeId)!.get('state'), extensionIndex[nodeKey.type])
}, [nodeKey])