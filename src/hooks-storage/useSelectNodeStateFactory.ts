import isEqual from "lodash.isequal";
import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "../structures/createNodeKeyFactory.js";


export type ImmutableLsonObject<U extends FlatAirNode> = ReturnType<LiveIndexNode<U>['toImmutable']>['state']

export const useSelectNodeStateFactory = <
    U extends FlatAirNode,
>(
    useStorage: LiveblocksHooks<U>['useStorage'],
) => <
    T extends U['type'],
    R
>(
    nodeKey: NodeKey<U, T>,
    selector: (
        immutableState: ImmutableLsonObject<(U&{type: T})>,
    ) => R
): R => useStorage(({liveIndex}) => selector(
    (liveIndex.get(nodeKey.nodeId)!.state),
), (a,b) => isEqual(a,b))