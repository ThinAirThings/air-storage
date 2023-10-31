import { LsonObject } from "@liveblocks/client";



export type TreeAirNode<
    T extends string=string,
    S extends LsonObject=LsonObject,
    C extends TreeAirNode[]|[]=TreeAirNode<string, LsonObject, any>[]|[]
> = {
    type: T,
    state: S,
    children: C
}

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
    children: children??[]
}) as TreeAirNode<T, S, C>

export const defineAirNodeTree = <
    C extends TreeAirNode[]
>(
    children: C
) => defineAirNode('root', {}, children)

export type ExtractChildTypeUnion<N extends FlatAirNode> = 
    N['childTypeSet'] extends Set<infer CT extends string> ? CT : never

export type FlatAirNode<
    T extends string=string,
    S extends LsonObject=LsonObject,
    CK extends string=string
> = {
    type: T,
    state: S,
    childTypeSet: Set<CK>
}

type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
export type TreeToUnion<T extends TreeAirNode> =
    IsEmptyArray<T['children']> extends true
        ? (FlatAirNode<T['type'], T['state'], never>)
        : (FlatAirNode<T['type'], T['state'], T['children'][number]['type']>)
        | ({
            [ChildType in T['children'][number]['type']]: TreeToUnion<
                (T['children'][number]&{type: ChildType})
            >
        }[T['children'][number]['type']])

export type AirNodeIndexedUnion<
    U extends TreeAirNode
> = {
    [T in U['type']]: (U&{type: T})
}

export type NodeKey<T extends string=string> = {
    nodeId: string
    type: T
}

