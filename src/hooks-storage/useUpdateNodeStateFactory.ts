import { LiveObject } from "@liveblocks/client";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import {  FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";


export const useUpdateNodeStateFactory = <
    U extends FlatAirNode,
>(
    useMutation: LiveblocksHooks<U>['useMutation'],
) => () => useMutation((
    {storage},
    nodeKey: NodeKey<U, U['type']>,
    callback: (
        liveIndexState: LiveObject<U['state']>,
    ) => void
)=>{
    callback(storage.get('liveIndex').get(nodeKey.nodeId)!.get('state'))
}, []) as <
    T extends U['type']
>(
    nodeKey: NodeKey<U, T>,
    callback: (
        liveIndexState: LiveObject<(U&{type: T})['state']>,
    ) => void
) => void
