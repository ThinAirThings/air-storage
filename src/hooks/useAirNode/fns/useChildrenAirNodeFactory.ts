import { LiveblocksHooks } from "../../../LiveObjects/LiveIndexStorageModel.js"
import { ExtractChildTypeUnion, FlatAirNode } from "../../../types.js"
import { NodeKey } from "../NodeKey.js"
import isEqual from "lodash.isequal"

export type AirNodeUseChildren<
    U extends FlatAirNode=FlatAirNode,
    T extends U['type']=U['type'],
> = <
    CT extends ExtractChildTypeUnion<(U&{type:T})>
>(
    childType: CT
) => Set<NodeKey<CT>>

export const useChildrenAirNodeFactory = <
    U extends FlatAirNode=FlatAirNode,
>(
    useStorage: LiveblocksHooks['useStorage'],
) => <
    T extends U['type']
>(
    nodeKey: NodeKey<T>
) => (
    childType: string
) => useStorage(({liveIndex}) => 
    new Set([...liveIndex.get(nodeKey.nodeId)!.childNodeSets.get(childType)!.keys()]
        .map(nodeId => new NodeKey(childType, nodeId))
    )
, (a, b) => isEqual(a, b))