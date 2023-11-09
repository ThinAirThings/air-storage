import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";



export const useSelfFocusedNodeKeyFactory = <
    U extends FlatAirNode
>(
    useSelf: LiveblocksHooks<U>['useSelf']
) => () => 
    useSelf(
        ({presence}) => presence.focusedNodeKey, 
        (a,b)=>isEqual(a,b)
    )