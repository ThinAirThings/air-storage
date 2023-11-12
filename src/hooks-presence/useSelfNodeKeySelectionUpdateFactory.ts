
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { NodeKey } from "../structures/createNodeKeyFactory.js";
import { FlatAirNode } from "../types.js";
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
        updateMyPresence({
            nodeKeySelection: [...newSelectedNodeKeySet]
        })
    }
}
