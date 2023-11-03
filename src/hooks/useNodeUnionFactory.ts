import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode, NodeKey } from "../types.js";


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
    NodeKey<P extends (node: U)=>node is (infer SU extends U)?SU['type']:never>
>