import { LsonObject } from "@liveblocks/client"

export type TreeAirNode<
    T extends string=string,
    S extends AirNodeState=AirNodeState,
    C extends TreeAirNode[]|[]=TreeAirNode<string, AirNodeState, any>[]|[]
> = {
    type: T,
    state: S,
    children: C
}

export type AirNodeState = LsonObject & {nodeName: string}

export const defineAirNode = <
    T extends string=string,
    S extends AirNodeState=AirNodeState,
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

export const defineRootAirNode = <
    C extends TreeAirNode[]
>(
    children: C
) => defineAirNode('root', {nodeName: 'root'}, children)

export type ExtractChildTypeUnion<N extends FlatAirNode> = 
    N['childTypeSet'] extends Set<infer CT extends string> ? CT : never

export type FlatAirNode<
    T extends string=string,
    S extends AirNodeState=AirNodeState,
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

