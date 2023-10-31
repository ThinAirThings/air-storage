import { LiveblocksHooks } from "../../../LiveObjects/LiveIndexStorageModel.js";
import { NodeKey } from "../NodeKey.js";



export type AirNodeUseNodeName = () => string

export const useAirNodeNameFactory = (
    useStorage: LiveblocksHooks['useStorage']
) => (nodeKey: NodeKey) => useStorage(({liveIndex}) => {
    return liveIndex.get(nodeKey.nodeId)!.state.nodeName
})