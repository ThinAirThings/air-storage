

import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { NodeKey } from "../structures/createNodeKeyFactory.js";
import { FlatAirNode } from "../types.js";
import { useSelfNodeKeySelectionFactory } from "./useSelfNodeKeySelectionFactory.js";

export const useSelfNodeKeySelectionRemoveFactory = <
    U extends FlatAirNode
>(
    useUpdateMyPresence: LiveblocksHooks<U>['useUpdateMyPresence'],
    useSelfNodeKeySelection: ReturnType<typeof useSelfNodeKeySelectionFactory<U>>
) => () => {
    const updateMyPresence = useUpdateMyPresence()
    const nodeKeySelection = useSelfNodeKeySelection()
    return (
        nodeKey: NodeKey<U>
    ) => {
        // If node key is in the set, remove it
        if(nodeKeySelection.some(({nodeId})=>nodeId===nodeKey.nodeId)){ 
            updateMyPresence({
                nodeKeySelection: nodeKeySelection.filter(({nodeId})=>nodeId!==nodeKey.nodeId)
            })
            return true
        }
        return false
    }
}