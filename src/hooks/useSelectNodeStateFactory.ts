import isEqual from "lodash.isequal";
import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";


export type ImmutableLsonObject<U extends FlatAirNode> = ReturnType<LiveIndexNode<U>['toImmutable']>['state']

export const useSelectNodeStateFactory = <
    U extends FlatAirNode,
    ExtIndex extends Record<string, any>
>(
    useStorage: LiveblocksHooks<U>['useStorage'],
    extensionIndex: ExtIndex
) => <
    T extends U['type'],
    R
>(
    nodeKey: NodeKey<U, T>,
    selector: (
        immutableState: ImmutableLsonObject<(U&{type: T})>,
        ext: ExtIndex[T]
    ) => R
): R => useStorage(({liveIndex}) => selector(
    (liveIndex.get(nodeKey.nodeId)!.state),
    extensionIndex[nodeKey.type]
), (a,b) => isEqual(a,b))