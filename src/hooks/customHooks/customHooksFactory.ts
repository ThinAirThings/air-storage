import { FlatAirNode } from "../../types.js";
import { LiveblocksHooks } from "../../LiveObjects/LiveIndexStorageModel.js";



export const customHooksFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks['useMutation'],
    useStorate: LiveblocksHooks['useStorage']
) => ({
    
})


