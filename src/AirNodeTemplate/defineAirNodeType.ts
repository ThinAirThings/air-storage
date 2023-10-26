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
    CustomType extends string = string,
    Metadata extends JsonObject=JsonObject,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends TreeNodeType[]|[]=TreeNodeType<any, any, any, any>[]|[]
> = {
    customType: CustomType,
    metadata: Metadata,
    state: State,
    children: ChildNodeTypes
}

export type AirNodeType<
    CustomType extends string = string,
    Metadata extends JsonObject=JsonObject,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends string=string
> = {
    customType: CustomType,
    metadata: Metadata,
    state: State,
    childTypes: ChildNodeTypes
}

export type FlattenTree<T extends TreeNodeType> =  
    IsEmptyArray<T['children']> extends true
        ? (AirNodeType<T['customType'], T['metadata'], T['state'], never>)
        : (AirNodeType<T['customType'], T['metadata'], T['state'], T['children'][number]['customType']>) 
        | ({
            [ChildType in T['children'][number]['customType']]: FlattenTree<
                (T['children'][number]&{customType: ChildType})
            >
        }[T['children'][number]['customType']])

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
    CustomType extends string = string,
    Metadata extends JsonObject=JsonObject,
    State extends LsonObject=LsonObject,
    ChildNodeTypes extends TreeNodeType[]|[] = []
>(
    customType: CustomType,
    props: TreeNodeProps<Metadata, State>,
    children: ChildNodeTypes
) => ({
    customType,
    metadata: props.metadata??{},
    state: props.initialState??{},
    children: children??[]
}) as TreeNodeType<CustomType, Metadata, State, ChildNodeTypes>





        

    