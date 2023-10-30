import {LiveObject, LsonObject, JsonObject, Lson} from '@liveblocks/client'
import { LiveIndexNode } from '../LiveObjects/LiveIndexNode.js';
import { BaseFunctionSetProps } from '../createFunctionSet.js';
//   _____                 ___             _   _             
//  |_   _|  _ _ __  ___  | __|  _ _ _  __| |_(_)___ _ _  ___
//    | || || | '_ \/ -_) | _| || | ' \/ _|  _| / _ \ ' \(_-<
//    |_| \_, | .__/\___| |_| \_,_|_||_\__|\__|_\___/_||_/__/
//        |__/|_|                                            
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
export type ExtractState<U extends AirNodeType, T extends U['type']> = (U&{type: T}) extends AirNodeType<T, infer State> ? State:never
export type ExtractChildTypes<U extends AirNodeType, T extends U['type']> = (U&{type: T}) extends AirNodeType<T, any, infer ChildTypes> ? ChildTypes:never


export type NodeKey<T> = {
    type: T,
    nodeId: string
}

export type TreeNodeType<
    Type extends string = string,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends TreeNodeType[]|[]=TreeNodeType<any, any, any>[]|[]
> = {
    type: Type,
    state: State
    children: ChildNodeTypes
}

export interface StaticTreeNodeType extends TreeNodeType {
    functionSetBuilder: () => {
        create: (liveIndexNode: LiveIndexNode, initialState?: JsonObject) => void,
        storage: (immutableIndexNode: ReturnType<LiveIndexNode['toImmutable']>, key: keyof JsonObject) => JsonObject[keyof JsonObject],
        mutate: (liveIndexNode: LiveIndexNode, key: keyof JsonObject, value: JsonObject[keyof JsonObject]) => void,
        delete: (liveIndexNode: LiveIndexNode) => void
    }
}
export type AirNodeType<
    Type extends string=string,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends string=string
> = {
    type: Type,
    state: State,
    childTypeSet: ChildNodeTypes
}

export type FlattenTree<T extends TreeNodeType> =  
    IsEmptyArray<T['children']> extends true
        ? (AirNodeType<T['type'], T['state'], never>)
        : (AirNodeType<T['type'], T['state'], T['children'][number]['type']>) 
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
) => defineAirNodeType("root", {
    dummy: "string"
}, toplevelNodes)


export const defineAirNodeType= <
    Type extends string=string,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends TreeNodeType[]|[] = []
>(
    type: Type,
    defaultInitialState: State,
    children: ChildNodeTypes
) => ({
    type,
    state: defaultInitialState,
    children: children??[]
}) as TreeNodeType<Type, State, ChildNodeTypes>