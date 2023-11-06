import { LiveblocksHooks } from "../LiveObjects/LiveIndexStorageModel.js"
import { LiveIndexNode } from "../index.browser.js"
import { FlatAirNode } from "../types.js"



export const useUniversalNodeSetFactory = <
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