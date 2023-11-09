import { LiveMap, LiveObject } from "@liveblocks/client";
import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { ExtractChildTypeUnion, FlatAirNode } from "../types.js";
import { v4 as uuidv4} from 'uuid'
import { MappedUnion } from "../types/MappedUnion.js";
import { NodeKey, createNodeKey } from "../types/NodeKey.js";

export const useCreateNodeFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks<U>['useMutation'],
    mappedAirNodeUnion: MappedUnion
) => () => useMutation((
        {storage},
        nodeKey: NodeKey<U, U['type']>,
        childType: U['childTypeSet'] extends Set<infer CT extends string> ? CT : never,
        callback?: (liveIndexNode: LiveIndexNode<FlatAirNode>) => void
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
    storage.get('liveIndex').set(nodeId, newLiveIndexNode as any)
    return createNodeKey(nodeId, childType)
}, []) as <
    T extends U['type'],
    CT extends ExtractChildTypeUnion<(U&{type: T})>,
    R extends NodeKey<U, CT>
>(
    nodeKey: NodeKey<U, T>,
    childType: CT,
    callback?: (liveIndexNode: LiveIndexNode<(U&{type: CT})>) => void
) => R


//   _  _  ___ _____ ___ 
//  | \| |/ _ \_   _| __|
//  | .` | (_) || | | _| 
//  |_|\_|\___/ |_| |___|
// This is the proper way to do return callback typing        
