import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { useSelfFocusedNodeKeyFactory } from "./useSelfFocusedNodeKeyFactory.js";
import { useSelfNodeKeySelectionAddFactory } from "./useSelfNodeKeySelectionAddFactory.js";
import { useSelfNodeKeySelectionRemoveFactory } from "./useSelfNodeKeySelectionRemoveFactory.js";
import { NodeKey } from "../structures/createNodeKeyFactory.js";

export const useSelfFocusedNodeKeyUpdateFactory = <
    U extends FlatAirNode
>(
    useUpdateMyPresence: LiveblocksHooks<U>['useUpdateMyPresence'],
    useSelfFocusedNodeKey: ReturnType<typeof useSelfFocusedNodeKeyFactory<U>>,
    useSelfNodeKeySelectionAdd: ReturnType<typeof useSelfNodeKeySelectionAddFactory<U>>,
    useSelfNodeKeySelectionRemove: ReturnType<typeof useSelfNodeKeySelectionRemoveFactory<U>>
) => () => {
    const updateMyPresence = useUpdateMyPresence()
    const addToNodeKeySelection = useSelfNodeKeySelectionAdd()
    const removeFromNodeKeySelection = useSelfNodeKeySelectionRemove()
    const focusedNodeKey = useSelfFocusedNodeKey()
    return (nodeKey: NodeKey<U> | null) => {
        if (!isEqual(focusedNodeKey, nodeKey)) {
            updateMyPresence({
                focusedNodeKey: nodeKey
            })
            nodeKey 
                ? addToNodeKeySelection(nodeKey) 
                : focusedNodeKey
                    ? removeFromNodeKeySelection(focusedNodeKey)
                    : null
            return true
        }
        return false
    }
}