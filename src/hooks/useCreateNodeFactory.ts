import { LiveMap, LiveObject, LsonObject } from "@liveblocks/client";
import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { ExtractChildTypeUnion, FlatAirNode } from "../types.js";
import { v4 as uuidv4} from 'uuid'
import { MappedUnion } from "../types/MappedUnion.js";
import { NodeKey } from "../types/NodeKey.js";

export const useCreateNodeFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks['useMutation'],
    mappedAirNodeUnion: MappedUnion
) => <
    T extends U['type']
>(
    nodeKey: NodeKey<T>,
) => useMutation((
        {storage},
        childType: string,
        callback?: (liveIndexNode: LiveIndexNode<LsonObject>) => void
    ) => {
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
}, []) as <
    CT extends ExtractChildTypeUnion<(U&{type: T})>,
    R extends NodeKey<CT>
>(
    childType: CT,
    callback?: (liveIndexNode: LiveIndexNode<(U&{type: CT})['state']>) => void
) => R


//   _  _  ___ _____ ___ 
//  | \| |/ _ \_   _| __|
//  | .` | (_) || | | _| 
//  |_|\_|\___/ |_| |___|
// This is the proper way to do return callback typing        
