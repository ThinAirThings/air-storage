import { LsonObject } from "@liveblocks/client"
import { TreeAirNode } from "./types.js"

export const defineAirNode = <
    T extends string=string,
    Skt extends Record<string, any>=Record<string, any>,
    S extends LsonObject=LsonObject,
    C extends TreeAirNode[]|[]=[]
>(
    type: T,
    struct: Skt,
    defaultInitialState: S,
    children: C
) => ({
    type,
    struct,
    state: defaultInitialState,
    children: children??[],
    // destructor?:
}) as TreeAirNode<T, Skt, S, C>

export const defineAirNodeSchema = <
    C extends TreeAirNode[]
>(
    children: C
) => defineAirNode('root', {}, {}, children)

