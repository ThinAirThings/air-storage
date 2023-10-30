import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../../../../createFunctionSet.js";
import { LiveIndexNode } from "../../../LiveObjects/LiveIndexNode.js";
import { FlatAirNode } from "../../../types.js";
import { NodeKey } from "../NodeKey.js";

export type AirNodeUseSelect<
    U extends FlatAirNode=FlatAirNode,
    T extends U['type']=U['type'],
    S extends (U&{type: T})['state']=(U&{type: T})['state'],
> = <R>(selector: (immutableIndexNode: ReturnType<LiveIndexNode<S>['toImmutable']>) => R) => R

export const useSelectAirNodeFactory = <
    U extends FlatAirNode=FlatAirNode,
>(
    useStorage: LiveblocksHooks['useStorage']
) => <
    T extends U['type'],
>(
    nodeKey: NodeKey<T>,
) => <R>(
    selector: (immutableIndexNode: ReturnType<LiveIndexNode<U['state']>['toImmutable']>) => R
) => useStorage(({liveIndex}) => {
    return selector(liveIndex.get(nodeKey.nodeId)! as ReturnType<LiveIndexNode<U['state']>['toImmutable']>) as R
}, (a,b) => isEqual(a,b))