import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";
import { LiveIndexNode } from "../index.browser.js";


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
    NodeKey<U, P['type']>
>

















