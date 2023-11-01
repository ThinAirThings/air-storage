import { LsonObject } from "@liveblocks/client"
import { TreeAirNode } from "./types.js"


export const defineAirNode = <
    T extends string=string,
    Ext extends Record<string, any>=Record<string, any>,
    S extends LsonObject=LsonObject,
    C extends TreeAirNode[]|[]=[]
>(
    type: T,
    ext: Ext,
    defaultInitialState: S,
    children: C
) => ({
    type,
    ext,
    state: defaultInitialState,
    children: children??[],
    // destructor?:
}) as TreeAirNode<T, Ext, S, C>

export const defineRootAirNode = <
    C extends TreeAirNode[]
>(
    children: C
) => defineAirNode('root', {}, {nodeName: 'root'}, children)

