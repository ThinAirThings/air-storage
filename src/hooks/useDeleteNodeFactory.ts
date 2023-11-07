import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { NodeKey, createNodeKey } from "../types/NodeKey.js";


export const useDeleteNodeFactory = <
    U extends FlatAirNode,
    ExtIndex extends Record<string, any>
>(
    useMutation: LiveblocksHooks['useMutation'],
    extensionIndex: ExtIndex
) => () => useMutation((
        {storage},
        nodeKey: NodeKey<U, U['type']>,
        callback?: (
            liveIndexNode: LiveIndexNode<(U&{type: U['type']})>,
            ext: ExtIndex[U['type']]
        ) => void
    ) => {
    // Run callback before deleting node
    callback?.(
        storage.get('liveIndex').get(nodeKey.nodeId)! as LiveIndexNode<(U&{type: U['type']})>,
        extensionIndex[nodeKey.type]
    )
    // Index Cleanup
    const liveIndex = storage.get('liveIndex')
    const thisNode = liveIndex.get(nodeKey.nodeId)!
    const parentNode = liveIndex.get(thisNode.get('parentNodeId')!)!
    // Delete Children
    const deleteChildren = (node: LiveIndexNode) => {
        liveIndex.delete(node.get('nodeId'))
        node.get('childNodeSets').forEach((childNodeSet) => {
            childNodeSet.forEach((_, childNodeId) => {
                deleteChildren(liveIndex.get(childNodeId)!)
            })
        })
    }
    deleteChildren(thisNode)
    // Delete self from parent
    parentNode.get('childNodeSets').get(nodeKey.type)!.delete(nodeKey.nodeId)
    // Return Sibling NodeKey
    const sibblingNodeId = [...parentNode.get('childNodeSets').get(nodeKey.type)!.keys()][0]
    return createNodeKey(sibblingNodeId, nodeKey.type)
}, []) as <
    T extends U['type']
>(
    nodeKey: NodeKey<U, T>,
    callback?: (
        liveIndexNode: LiveIndexNode<(U&{type: T})>,
        ext: ExtIndex[T]
    ) => void
) => NodeKey<U, T>