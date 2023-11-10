import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";

export const useSelfNodeKeySelectionFactory = <
    U extends FlatAirNode
>(
    useSelf: LiveblocksHooks<U>['useSelf']
) => () => 
    useSelf(
        ({presence}) => presence.nodeKeySelection
    )