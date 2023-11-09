import { TreeAirNode } from "./types.js";

export const treeToStructureIndex = <Tree extends TreeAirNode>(
    tree: Tree
): TreeToStaticIndex<Tree> => {
    const index = {} as Record<string, any>
    const visit = (node: TreeAirNode) => {
        if(Object.keys(node.struct).length > 0) {
            index[node.type] = node.struct
        }
        node.children.forEach(visit)
    }
    visit(tree)
    return index as TreeToStaticIndex<Tree>
}

type IsEmptyRecord<T> = keyof T extends never ? true : false;

export type UnionToIntersection<U> = 
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TreeToStaticUnion<T extends TreeAirNode> = 
    IsEmptyRecord<T['struct']> extends true
        ? never | ({
            [ChildType in T['children'][number]['type']]: TreeToStaticUnion<
                (T['children'][number]&{type: ChildType})
            >
        }[T['children'][number]['type']])
        : {[type in T['type']]: T['struct']}
        | ({
            [ChildType in T['children'][number]['type']]: TreeToStaticUnion<
                (T['children'][number]&{type: ChildType})
            >
        }[T['children'][number]['type']])

export type TreeToStaticIndex<T extends TreeAirNode> =
    UnionToIntersection<TreeToStaticUnion<T>>



