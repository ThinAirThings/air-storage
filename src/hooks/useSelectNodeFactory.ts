import isEqual from "lodash.isequal";
import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";


export type ImmutableLsonObject<T extends FlatAirNode> = ReturnType<LiveIndexNode<T['state']>['toImmutable']>['state']

export const useSelectNodeStateFactory = <
    U extends FlatAirNode
>(
    useStorage: LiveblocksHooks['useStorage']
) => <
    T extends U['type'],
    R
>(
    nodeKey: NodeKey<T>,
    selector: (immutableState: ImmutableLsonObject<(U&{type: T})>) => R
): R => useStorage(({liveIndex}) => selector(
    (liveIndex.get(nodeKey.nodeId)!.state as ImmutableLsonObject<(U&{type: T})>) 
), (a,b) => isEqual(a,b))