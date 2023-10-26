import {LiveObject, LsonObject, JsonObject} from '@liveblocks/client'
//   _____                 ___             _   _             
//  |_   _|  _ _ __  ___  | __|  _ _ _  __| |_(_)___ _ _  ___
//    | || || | '_ \/ -_) | _| || | ' \/ _|  _| / _ \ ' \(_-<
//    |_| \_, | .__/\___| |_| \_,_|_||_\__|\__|_\___/_||_/__/
//        |__/|_|                                            
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;

type TreeNodeProps<
    Metadata extends JsonObject=JsonObject,
    State extends LsonObject=LsonObject,
> = {
    metadata?: Metadata,
    initialState?: State
}

export type TreeNodeType<
    Type extends string = string,
    Metadata extends JsonObject=JsonObject,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends TreeNodeType[]|[]=TreeNodeType<any, any, any, any>[]|[]
> = {
    type: Type,
    metadata: Metadata,
    state: State,
    children: ChildNodeTypes
}

export type AirNodeType<
    Type extends string = string,
    Metadata extends JsonObject=JsonObject,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends string=string
> = {
    type: Type,
    metadata: Metadata,
    state: State,
    childTypes: ChildNodeTypes
}

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

export const defineAirNodeType= <
    Type extends string = string,
    Metadata extends JsonObject=JsonObject,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends TreeNodeType[]|[] = []
>(
    type: Type,
    props: TreeNodeProps<Metadata, State>,
    children: ChildNodeTypes
) => ({
    type,
    metadata: props.metadata??{},
    state: props.initialState??{},
    children: children??[]
}) as TreeNodeType<Type, Metadata, State, ChildNodeTypes>





        

    