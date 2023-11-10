
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "../types/NodeKey.js"
import { useSelfNodeKeySelectionFactory } from "./useSelfNodeKeySelectionFactory.js";

export const useSelfNodeKeySelectionUpdateFactory = <
    U extends FlatAirNode
>(
    useUpdateMyPresence: LiveblocksHooks<U>['useUpdateMyPresence'],
    useSelfNodeKeySelection: ReturnType<typeof useSelfNodeKeySelectionFactory<U>>
) => () => {
    const updateMyPresence = useUpdateMyPresence()
    const nodeKeySelection = useSelfNodeKeySelection()
    return (
        updater: (nodeKeySelection: Array<NodeKey<U>>) => Array<NodeKey<U>>
    ) => {
        const newSelectedNodeKeySet = updater([...new Set(nodeKeySelection)])
        console.log("Called Updater")
        console.log("New Selected Node Key Set", newSelectedNodeKeySet)
        updateMyPresence({
            nodeKeySelection: [...newSelectedNodeKeySet]
        })
    }
}
