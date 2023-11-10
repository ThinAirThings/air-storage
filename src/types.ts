import { LsonObject } from "@liveblocks/client"
import {NodeKey} from './types/NodeKey.js'
import { ScreenState } from "@thinairthings/zoom-utils"

export type TreeAirNode<
    T extends string=string,
    Skt extends Record<string, any>=Record<string, any>,
    S extends LsonObject=LsonObject ,
    C extends TreeAirNode[]|[]=TreeAirNode<string, Record<string, any>, LsonObject , any>[]|[]
> = {
    type: T,
    struct: Skt,
    state: S,
    children: C
}

export type FlatAirNode<
    T extends string=string,
    Skt extends Record<string, any>=Record<string, any>,
    S extends LsonObject=LsonObject ,
    CK extends string=string
> = {
    type: T,
    struct: Skt,
    state: S,
    childTypeSet: CK
}
export type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
export type TreeToNodeUnion<T extends TreeAirNode> =
    IsEmptyArray<T['children']> extends true
        ? (FlatAirNode<T['type'], T['struct'], T['state'], never>)
        : (T['type'] extends 'root' ? never : (FlatAirNode<T['type'], T['struct'], T['state'], T['children'][number]['type']>))
        | ({
            [ChildType in T['children'][number]['type']]: TreeToNodeUnion<
                (T['children'][number]&{type: ChildType})
            >
        }[T['children'][number]['type']])

export type AirNodeIndexedUnion<
    U extends TreeAirNode
> = {
    [T in U['type']]: (U&{type: T})
}

export type AirPresence<
    U extends FlatAirNode
> = {
    absoluteSelectionBounds: ScreenState | null
    nodeKeySelection: Array<NodeKey<U>>
    focusedNodeKey: NodeKey<U>|null
}

