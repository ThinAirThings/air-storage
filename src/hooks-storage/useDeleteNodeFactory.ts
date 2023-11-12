import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { useSelfNodeKeySelectionRemoveFactory } from "../hooks-presence/useSelfNodeKeySelectionRemoveFactory.js";
import { NodeKey } from "../structures/createNodeKeyFactory.js";
import { FlatAirNode } from "../types.js";


export const useDeleteNodeFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks<U>['useMutation'],
    useRemoveFromNodeKeySelection: ReturnType<typeof useSelfNodeKeySelectionRemoveFactory<U>>
) => () => {
    const removeFromNodeKeySelection = useRemoveFromNodeKeySelection()
    return useMutation((
            {storage},
            nodeKey: NodeKey<U, U['type']>,
            callback?: (
                liveIndexNode: LiveIndexNode<(U&{type: U['type']})>,
            ) => void
        ) => {
        // Run callback before deleting node
        callback?.(
            storage.get('liveIndex').get(nodeKey.nodeId)! as LiveIndexNode<(U&{type: U['type']})>,
        )
        // Index Cleanup
        const liveIndex = storage.get('liveIndex')
        const thisNode = liveIndex.get(nodeKey.nodeId)!
        const parentNode = liveIndex.get(thisNode.get('parentNodeId')!)!
        // Delete Children
        const deleteChildren = (node: LiveIndexNode) => {
            liveIndex.delete(node.get('nodeId'))
            node.get('childNodeKeyMap').forEach(({nodeId}) => {
                deleteChildren(liveIndex.get(nodeId)!)
            })
        }
        deleteChildren(thisNode)
        // Delete self from parent
        parentNode.get('childNodeKeyMap').delete(nodeKey.nodeId)
        // Update nodeKeySelection
        removeFromNodeKeySelection(nodeKey)
    }, []) as <
        T extends U['type']
    >(
        nodeKey: NodeKey<U, T>,
        callback?: (
            liveIndexNode: LiveIndexNode<(U&{type: T})>,
        ) => void
    ) => NodeKey<U, T>
} 