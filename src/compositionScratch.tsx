import {LiveObject, LsonObject, JsonObject, LiveMap, createClient} from '@liveblocks/client'
import { ILiveIndexNode, ILiveIndexStorageModel, LiveIndexNode, LiveIndexStorageModel } from './LiveObjects/LiveIndexNode.js';
import {v4 as uuidv4} from 'uuid'
import { createRoomContext } from '@liveblocks/react';
import { createContext, useEffect, useState } from 'react';
import { BaseFunctionSetProps } from './createFunctionSet.js';
//   _____                 ___             _   _             
//  |_   _|  _ _ __  ___  | __|  _ _ _  __| |_(_)___ _ _  ___
//    | || || | '_ \/ -_) | _| || | ' \/ _|  _| / _ \ ' \(_-<
//    |_| \_, | .__/\___| |_| \_,_|_||_\__|\__|_\___/_||_/__/
//        |__/|_|                                            
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;



export type FlattenTree<T extends TreeNodeType> =  
    IsEmptyArray<T['children']> extends true
        ? (AirNodeType<T['type'], T['metadata'], T['state'], never>)
        : (AirNodeType<T['type'], T['metadata'], T['state'], T['children'][number]['type']>) 
        | ({
            [ChildType in T['children'][number]['type']]: FlattenTree<
                (T['children'][number]&{type: ChildType})
            >
        }[T['children'][number]['type']])

//   ___          _   _             ___             _   _             
//  | _ \_  _ _ _| |_(_)_ __  ___  | __|  _ _ _  __| |_(_)___ _ _  ___
//  |   / || | ' \  _| | '  \/ -_) | _| || | ' \/ _|  _| / _ \ ' \(_-<
//  |_|_\\_,_|_||_\__|_|_|_|_\___| |_| \_,_|_||_\__|\__|_\___/_||_/__/

export const defineAirNodeSchema = <
    ChildNodeTypes extends TreeNodeType[]
>(
    toplevelNodes: ChildNodeTypes
) => defineAirNodeType(
    "root",
    {},
    toplevelNodes
)

export type TreeNodeType<
    Type extends string = string,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends TreeNodeType[]|[]=TreeNodeType<any, any, any>[]|[]
> = {
    type: Type,
    baseFunctionSetProps: TreeNodeProps<State>,
    children: ChildNodeTypes
}

export type AirNodeType<
    Type extends string = string,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends string=string
> = {
    type: Type,
    baseFunctionSetProps: TreeNodeProps<State>,
    childTypeSet: Set<ChildNodeTypes>
}

type NodeKey<T> = {
    type: T,
    nodeId: string
}
type LiveblocksHooks = ReturnType<typeof createRoomContext<any, ILiveIndexStorageModel>>['suspense']


type ExtractState<U extends AirNodeType, T extends U['type']> = (U&{type: T}) extends AirNodeType<T, infer State> ? State:never
type ExtractChildTypes<U extends AirNodeType, T extends U['type']> = (U&{type: T}) extends AirNodeType<T, any, infer ChildTypes> ? ChildTypes:never
export const useAirNodeFactory = <
    U extends AirNodeType
>(
    Index: Map<U['type'], U>
)=><
    T extends U['type'],
    FK extends keyof ReturnType<typeof createFunctionSet<ExtractState<U, T>, ExtractChildTypes<U, T>>>
>(
    nodeKey: NodeKey<T>,
    functionKey: FK,
    ...params: Parameters<ReturnType<typeof createFunctionSet<ExtractState<U, T>, ExtractChildTypes<U, T>>>[FK]>
): ReturnType<ReturnType<typeof createFunctionSet<ExtractState<U, T>, ExtractChildTypes<U, T>>>[FK]> => {
    const node = Index.get(nodeKey.type)
    if(!node) throw new Error(`No node found for type ${nodeKey.type}`)
    const functionHandle = node.baseFunctionSet[functionKey] as any
    return functionHandle(...params)
}


type TreeNodeProps<
    State extends LsonObject=LsonObject,
> = {
    baseFunctionSet: BaseFunctionSetProps<State>
}

export const createFunctionSet = <State extends LsonObject, ChildTypes extends string=string>(defaultInitialState: State, 
    builder: () => {
        create: (liveIndexNode: LiveIndexNode<State>, initialState?: State) => void,
        storage: (immutableIndexNode: ReturnType<LiveIndexNode<State>['toImmutable']>, key: keyof State) => void,
        mutate: (liveIndexNode: LiveIndexNode<State>, ) => void,
        delete: (liveIndexNode: LiveIndexNode<State>) => void
    },
    liveblocksHooks: LiveblocksHooks,
    childTypeSet: Set<ChildTypes>
): {
    create: <PT extends AirNodeType['type'], T extends ChildTypes>
        (parentNodeKey: NodeKey<PT>, type: T, initialState?: State) => NodeKey<T>,
    useStorage: <K extends keyof State>(key: K) => State[K],
    mutate: <K extends keyof State>(key: K, value: State[K]) => void,
    delete: () => void
} => {
        const customFunctionSet = builder()
        return {
            create: liveblocksHooks.useMutation(<
                PT extends AirNodeType['type'], 
                T extends ChildTypes
            >( {storage}, parentNodeKey: NodeKey<PT>, type: T, initialState: State) => {
                const nodeId = uuidv4()
                const liveIndexNode = new LiveIndexNode({
                    nodeId: '',
                    type,
                    parentNodeId: parentNodeKey.nodeId,
                    parentType: parentNodeKey.type,
                    state: new LiveObject(initialState??defaultInitialState),
                    childNodeSets: new LiveMap([...childTypeSet].map(childType => [childType, new LiveMap()]))
                })
                customFunctionSet.create(liveIndexNode, initialState)
                parentNode.get('childNodeIds').get(type).set(liveIndexNode.id, null)
                return {
                    type,
                    nodeId: liveIndexNode.id
                }
            }, [])
        }
    }

export const defineAirNodeType= <
    Type extends string = string,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends TreeNodeType[]|[] = []
>(
    type: Type,
    props: TreeNodeProps<State>,
    children: ChildNodeTypes
) => ({
    type,
    functionSetProps: props,    // This can be expanded to accomodate things like indexed components
    children: children??[]
}) as TreeNodeType<Type, State, ChildNodeTypes>


        

    