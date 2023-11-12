import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { NodeKey } from "../structures/createNodeKeyFactory.js";
import { FlatAirNode } from "../types.js";
import { useSelfNodeKeySelectionFactory } from "./useSelfNodeKeySelectionFactory.js";



export const useSelfNodeKeySelectionAddFactory = <
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
        // If node key is not in the set, add it
        if(!nodeKeySelection.some(({nodeId})=>nodeId===nodeKey.nodeId)){ 
            updateMyPresence({
                nodeKeySelection: [...nodeKeySelection, nodeKey]
            })
            return true
        }
        return false
    }
}