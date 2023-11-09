import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js"
import { FlatAirNode } from "../types.js"

export const useNodeSetFactory = <
    U extends FlatAirNode
>(
    useStorage: LiveblocksHooks<U>['useStorage']
) => <
    R
>(
    morphism: (liveIndex: Parameters<Parameters<LiveblocksHooks<U>['useStorage']>[0]>[0]['liveIndex'] ) => R
) => useStorage(({liveIndex}) => {
    return morphism(liveIndex)
}) as R