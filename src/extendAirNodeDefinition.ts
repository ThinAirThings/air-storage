import { LsonObject } from "@liveblocks/client";
import { defineAirNode } from "./defineAirNode.js";
import { TreeAirNode } from "./types.js";


export const extendAirNodeDefinition = <
    Ext extends Record<string, any>
>() => <
    T extends string=string,
    S extends LsonObject=LsonObject,
    C extends TreeAirNode[]|[]=[]
>(
    type: T,
    ext: Ext,
    defaultInitialState: S,
    children: C
) => defineAirNode(type, ext, defaultInitialState, children)

export const treeToStructureIndex = <Tree extends TreeAirNode>(
    tree: Tree
): TreeToExtensionIndex<Tree> => {
    const index = {} as Record<string, any>
    const visit = (node: TreeAirNode) => {
        console.log(node)
        if(node.struct.keys().length > 0) {
            index[node.type] = node.struct
        }
        node.children.forEach(visit)
    }
    visit(tree)
    return index as TreeToExtensionIndex<Tree>
}

type IsEmptyRecord<T> = keyof T extends never ? true : false;

export type UnionToIntersection<U> = 
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TreeToExtensionUnion<T extends TreeAirNode> = 
    IsEmptyRecord<T['struct']> extends true
        ? never | ({
            [ChildType in T['children'][number]['type']]: TreeToExtensionUnion<
                (T['children'][number]&{type: ChildType})
            >
        }[T['children'][number]['type']])
        : {[type in T['type']]: T['struct']}
        | ({
            [ChildType in T['children'][number]['type']]: TreeToExtensionUnion<
                (T['children'][number]&{type: ChildType})
            >
        }[T['children'][number]['type']])

export type TreeToExtensionIndex<T extends TreeAirNode> =
    UnionToIntersection<TreeToExtensionUnion<T>>



