import { LiveMap, LiveObject } from "@liveblocks/client";
import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { v4 as uuidv4} from 'uuid'
import { MappedUnion } from "../types/MappedUnion.js";
import { NodeKey, createNodeKey } from "../types/NodeKey.js";
import { useSelfFocusedNodeKeyUpdateFactory } from "../hooks-presence/useSelfFocusedNodeKeyUpdateFactory.js";

export const useCreateNodeFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks<U>['useMutation'],
    useSelfFocusedNodeKeyUpdate: ReturnType<typeof useSelfFocusedNodeKeyUpdateFactory<U>>,
    mappedAirNodeUnion: MappedUnion
) => () => {
    const updateFocusedNodeKey = useSelfFocusedNodeKeyUpdate()
    return useMutation((
        {storage},
        parentNodeKey: NodeKey<U> | null,
        childType: U['type'],
        callback?: (liveIndexNode: LiveIndexNode<FlatAirNode>) => void
    ) => {
        const nodeId = uuidv4()
        const newLiveIndexNode = new LiveIndexNode({
            nodeId,
            type: childType,
            parentNodeId: parentNodeKey?.nodeId??null,
            parentType: parentNodeKey?.type??null,
            state: new LiveObject(mappedAirNodeUnion.get(childType).state),
            childNodeKeyMap: new LiveMap<string, NodeKey<U&{type: U['childTypeSet']}>>()
        })
        callback?.(newLiveIndexNode)
        // Update Index
        storage.get('liveIndex').get(parentNodeKey?.nodeId??'')?.get('childNodeKeyMap').set(nodeId, createNodeKey(newLiveIndexNode.toImmutable()))
        storage.get('liveIndex').set(nodeId, newLiveIndexNode)
        // Update Presence
        const newNodeKey = createNodeKey(newLiveIndexNode.toImmutable())
        updateFocusedNodeKey(newNodeKey)
        return newNodeKey
    }, []) as <
        T extends U['type'],
        CT extends (U&{type: T})['childTypeSet'],
        R extends NodeKey<U&{type: CT}>
    >(
        nodeKey: NodeKey<U, T> | null,
        childType: CT,
        callback?: (liveIndexNode: LiveIndexNode<(U&{type: CT})>) => void
    ) => R
}


//   _  _  ___ _____ ___ 
//  | \| |/ _ \_   _| __|
//  | .` | (_) || | | _| 
//  |_|\_|\___/ |_| |___|
// This is the proper way to do return callback typing        
