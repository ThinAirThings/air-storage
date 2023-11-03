import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";


export const useNodeUnionFactory = <
    U extends FlatAirNode
>(
    useStorage: LiveblocksHooks['useStorage']
) => <
    P extends (node: U) => node is U
>(
    predicate: P
) => useStorage(({liveIndex}) => {
    return ([...liveIndex.values()] as U[]).filter(predicate)
}, (a, b) => isEqual(a, b))