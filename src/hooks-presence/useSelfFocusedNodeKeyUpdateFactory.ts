import isEqual from "lodash.isequal";
import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js";
import { FlatAirNode } from "../types.js";
import { useSelfFocusedNodeKeyFactory } from "./useSelfFocusedNodeKeyFactory.js";
import {NodeKey} from "../types/NodeKey.js"

export const useSelfFocusedNodeKeyUpdateFactory = <
    U extends FlatAirNode
>(
    useUpdateMyPresence: LiveblocksHooks<U>['useUpdateMyPresence'],
    useSelfFocusedNodeKey: ReturnType<typeof useSelfFocusedNodeKeyFactory<U>>
) => () => {
    const updateMyPresence = useUpdateMyPresence()
    const focusedNodeKey = useSelfFocusedNodeKey()
    return (nodeKey: NodeKey<U> | null) => {
        if (!isEqual(focusedNodeKey, nodeKey)) {
            updateMyPresence({
                focusedNodeKey: nodeKey
            })
        }
    }
}