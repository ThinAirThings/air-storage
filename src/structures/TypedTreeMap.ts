import { AirNode, TreeNode } from "../AirNodeTemplate/defineAirNodeType.js"


export class TypedTreeMap<
    U extends AirNode
> extends Map<U['type'], U>{
    constructor(
        treeNode: TreeNode
    ){
        const arr: Array<[U['type'], U]> = []
        const flattenTree = (treeNode: TreeNode) => {
            if (treeNode.children.length > 0){
                arr.push([treeNode.type, {
                    type: treeNode.type,
                    childTypes: treeNode.children.map(child => child.type)
                } as U])
            }
        }
        flattenTree(treeNode)
        super(arr)
    }
    get<Type extends U['type']>(type: Type): (U&{type: Type}){
        return super.get(type)! as (U&{type: Type})
    }
}

