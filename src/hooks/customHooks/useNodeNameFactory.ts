import { LiveblocksHooks } from "../../LiveObjects/LiveIndexStorageModel.js";
import { NodeKey } from "../useAirNode/NodeKey.js";

export const useNodeNameFactory = (
    useStorage: LiveblocksHooks['useStorage']
) => (
    nodeKey: NodeKey
) => useStorage(({liveIndex}) => {
    return liveIndex.get(nodeKey.nodeId)!.state.nodeName
})