import { LsonObject } from "@liveblocks/client"
import { MutationContext } from "@liveblocks/react"
import { ILiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js"

export type TreeAirNode<
    T extends string=string,
    Ext extends Record<string, any>=Record<string, any>,
    S extends LsonObject=LsonObject ,
    C extends TreeAirNode[]|[]=TreeAirNode<string, Record<string, any>, LsonObject , any>[]|[]
> = {
    type: T,
    ext: Ext,
    state: S,
    children: C
}


export type ExtractChildTypeUnion<N extends FlatAirNode> = 
    N['childTypeSet'] extends Set<infer CT extends string> ? CT : never

export type FlatAirNode<
    T extends string=string,
    S extends LsonObject=LsonObject ,
    CK extends string=string
> = {
    type: T,
    state: S,
    childTypeSet: Set<CK>
}

type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;

export type TreeToNodeUnion<T extends TreeAirNode> =
    IsEmptyArray<T['children']> extends true
        ? (FlatAirNode<T['type'], T['state'], never>)
        : (FlatAirNode<T['type'], T['state'], T['children'][number]['type']>)
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

export type NodeKey<T extends string=string> = {
    nodeId: string
    type: T
}

export type AirStorageMutationContext = MutationContext<any, ILiveIndexStorageModel, any>
