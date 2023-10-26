
import { JsonObject } from "@liveblocks/client";

export type TreeNode<
    Type extends string = string,
    ChildNodeTypes extends TreeNode[]|[]=TreeNode<any, any>[]|[]
> = {
    type: Type,
    children: ChildNodeTypes
}

export const defineAirNodeSchema = <
    ChildNodeTypes extends TreeNode[]
>(
    toplevelNodes: ChildNodeTypes
) => defineAirNodeType(
    "root",
    toplevelNodes
)
type IsNotEmptyArray<T extends any[]> = T['length'] extends 0 ? false : true;
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
export const defineAirNodeType = <
    Type extends string = string,
    ChildNodeTypes extends TreeNode[]|[] = []
>(
    type: Type,
    children: ChildNodeTypes
) => ({
    type,
    children: children??[]
}) as TreeNode<Type, ChildNodeTypes>

type AirNode<
    Type extends string = string,
    ChildNodeTypes extends string=string
> = {
    type: Type,
    childTypes: ChildNodeTypes
}


// export type CreateAirNodeType<T extends TreeNode> = 
//     (AirNode<T['type'], IsNotEmptyArray<T['children']> extends true ? T['children'][number]['type']:never>)
//     | (IsNotEmptyArray<T['children']> extends true
//         ? {
//             [ChildType in T['children'][number]['type']]: CreateAirNodeType<(T['children'][number]&{type: ChildType})>
//         }[T['children'][number]['type']]
//         : never
//     )

export type CreateAirNodeType<T extends TreeNode> =  
    IsEmptyArray<T['children']> extends true
        ? (AirNode<T['type'], never>)
        : (AirNode<T['type'], T['children'][number]['type']>) 
        | ({
            [ChildType in T['children'][number]['type']]: CreateAirNodeType<
                (T['children'][number]&{type: ChildType})
            >
        }[T['children'][number]['type']])
        

    