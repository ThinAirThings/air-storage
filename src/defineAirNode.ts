import { LsonObject } from "@liveblocks/client"
import { TreeAirNode } from "./types.js"

export const defineAirNode = <
    T extends string=string,
    S extends LsonObject=LsonObject,
    C extends TreeAirNode[]|[]=[]
>(
    type: T,
    defaultInitialState: S,
    children: C
) => ({
    type,
    state: defaultInitialState,
    children: children??[],
    // destructor?:
}) as TreeAirNode<T, S, C>

export const defineAirNodeSchema = <
    C extends TreeAirNode[]
>(
    children: C
) => defineAirNode('root', {}, children)

