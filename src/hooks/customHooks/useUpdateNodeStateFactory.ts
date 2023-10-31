import { LiveObject } from "@liveblocks/client";
import { LiveblocksHooks } from "../../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../../types.js";
import { NodeKey } from "../useAirNode/NodeKey.js";


export const useUpdateNodeStateFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks['useMutation']
) => <
    T extends U['type']
>(
    nodeKey: NodeKey<T>,
    callback: (liveIndexState: LiveObject<(U&{type: T})['state']> ) => void
) => useMutation((
    {storage}
)=>{
    callback(storage.get('liveIndex').get(nodeKey.nodeId)!.get('state'))
}, [nodeKey, callback])