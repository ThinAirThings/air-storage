import { LiveIndexNode } from "../LiveObjects/LiveIndexNode.js";
import {v4 as uuidv4} from 'uuid'
import { createFunctionSet } from "../createFunctionSet.js";
import { AirNodeType, NodeKey } from "../AirNodeTypes/defineAirNodeType.js";
import { StaticNodeIndex } from "../configureAirStorage.js";


export const useAirGraphFactory = <
    U extends AirNodeType,
>(
    StaticIndex: StaticNodeIndex<U>,
) => <
    T extends U['type'],
    FK extends keyof ReturnType<typeof createFunctionSet>
>(
    nodeKey: NodeKey<T>,
    functionKey: FK,
    ...args: Parameters<ReturnType<ReturnType<typeof createFunctionSet<U, T>>[FK]>>
): ReturnType<ReturnType<typeof createFunctionSet<U, T>>[FK]> => {
    args[0]
    const nodeIndexValue = StaticIndex.get(nodeKey.type)!
    const functionHandle = nodeIndexValue.functionSet[functionKey]
    return (functionHandle(nodeKey) as any)(...args)
}
