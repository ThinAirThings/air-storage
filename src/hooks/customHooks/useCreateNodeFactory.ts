import { LiveMap, LiveObject } from "@liveblocks/client";
import { LiveIndexNode } from "../../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../../LiveObjects/LiveIndexStorageModel.js";
import { ExtractChildTypeUnion, FlatAirNode } from "../../types.js";
import {v4 as uuidv4} from 'uuid'
import { MappedUnion } from "../../types/MappedUnion.js";
import { NodeKey } from "../useAirNode/NodeKey.js";

export const useCreateNodeFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks['useMutation'],
    mappedAirNodeUnion: MappedUnion
) => <
    T extends U['type'],
    CT extends ExtractChildTypeUnion<(U&{type: T})>
>(
    nodeKey: NodeKey<T>,
    childType: CT,
    callback?: (liveIndexNode: LiveIndexNode<(U&{type: T})['state']>) => void
) => useMutation(({storage}) => {
    const nodeId = uuidv4()
    const newLiveIndexNode = new LiveIndexNode({
        nodeId,
        type: childType,
        parentNodeId: nodeKey.nodeId,
        parentType: nodeKey.type,
        state: new LiveObject(mappedAirNodeUnion.get(childType).state),
        childNodeSets: new LiveMap(
            [...mappedAirNodeUnion.get(childType).childTypeSet]
            .map(childType => [childType, new LiveMap()])
        )
    })
    callback?.(newLiveIndexNode)
    storage.get('liveIndex').get(nodeKey.nodeId)!.get('childNodeSets').get(childType)!.set(nodeId, null)
    storage.get('liveIndex').set(nodeId, newLiveIndexNode)
    return new NodeKey(nodeId, childType)
}, [])