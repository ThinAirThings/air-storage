import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { ExtractChildTypeUnion, FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js";

export const useChildrenKeysFactory = <
    U extends FlatAirNode
>(
    useStorage: LiveblocksHooks['useStorage']
) => <
    T extends U['type'],
    CT extends ExtractChildTypeUnion<(U&{type: T})>
>(
    nodeKey: NodeKey<T>,
    childType: CT
) => useStorage(({liveIndex}) => new Set(
    [...liveIndex.get(nodeKey.nodeId)!.childNodeSets.get(childType)!.keys()]
    .map(nodeId => new NodeKey(childType, nodeId))
), (a, b) => isEqual(a, b))