import isEqual from "lodash.isequal";
import { LiveIndexNode } from "../../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../../types.js";
import { NodeKey } from "../useAirNode/NodeKey.js";


export const useSelectNodeStateFactory = <
    U extends FlatAirNode
>(
    useStorage: LiveblocksHooks['useStorage']
) => <
    T extends U['type'],
>(
    nodeKey: NodeKey<T>,
    selector: <R>(immutableIndexNode: ReturnType<LiveIndexNode<(U&{type: T})['state']>['toImmutable']>) => R
) => useStorage(({liveIndex}) => selector(
    liveIndex.get(nodeKey.nodeId)! as ReturnType<LiveIndexNode<(U&{type: T})['state']>['toImmutable']>
), (a,b) => isEqual(a,b))