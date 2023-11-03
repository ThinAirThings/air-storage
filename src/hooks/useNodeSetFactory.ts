import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";
import { ILiveIndexNode, LiveIndexNode } from "../index.browser.js";
import { createRoomContext } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";


export const useNodeSetFactory = <
    U extends FlatAirNode
>(
    useStorage: LiveblocksHooks['useStorage']
) => <
    P extends ReturnType<LiveIndexNode<U['state']>['toImmutable']>
>(
    predicate: (node: ReturnType<LiveIndexNode<U['state']>['toImmutable']>) => node is P
) => useStorage(({liveIndex}) => {
    return new Set(
        [...liveIndex.values()].filter(predicate as any) as any
    )
}, (a, b) => isEqual(a, b)) as Set<
    NodeKey<P['type']>
>












// export const useNodeSetFactory = <
//     U extends FlatAirNode
// >(
//     useStorage: LiveblocksHooks['useStorage']
// ) => <
//     S extends 'universal' | Set<NodeKey<U['type']>>,    // Universal set or some subset
//     P extends S extends 'universal'
//         ? U
//         : S extends Set<NodeKey<infer T>>
//             ? (U&{type: T})
//             : never
// >(
//     nodeSet: S,
//     predicate: (node: S extends 'universal' 
//         ? LiveIndexNode<U['state']> 
//         : S extends Set<NodeKey<infer T>> ? LiveIndexNode<(U&{type: T})['state']> : never
//     ) => P
// ) => useStorage(({liveIndex}) => {
//     return new Set(
//         nodeSet === 'universal' 
//             ? [...liveIndex.values()].filter(predicate as any) as any
//             : [...nodeSet].filter(predicate as any) as any
//     )
            

// }, (a, b) => isEqual(a, b)) as Set<
//     NodeKey<P['type']>
// >










