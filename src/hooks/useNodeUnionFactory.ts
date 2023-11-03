import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";


export const useNodeUnionFactory = <
    U extends FlatAirNode
>(
    useStorage: LiveblocksHooks['useStorage']
) => <
    P extends U
>(
    predicate: (node: U) => node is P
) => useStorage(({liveIndex}) => {
    return new Set(([...liveIndex.values()] as U[]).filter(predicate)) as any
}, (a, b) => isEqual(a, b)) as Set<
    NodeKey<P['type']>
>