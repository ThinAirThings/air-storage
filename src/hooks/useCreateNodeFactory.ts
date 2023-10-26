import { LiveIndexNode, MutationHook } from "../LiveObjects/LiveIndexNode.js";
import {v4 as uuidv4} from 'uuid'


export const useCreateNodeFactory = <
    U extends AirNode,
>(
    NodeTypeIndex: Map<U['type'], U>,
    useMutation: MutationHook
) => <
    ParentNode extends U
>(
    parentNode: ParentNode,
    childType: ParentNode['childTypes']
) => {
    const nodeId = uuidv4()
    const node = new LiveIndexNode({
        nodeId,
        type: childType,
        parentId: parentNode.nodeId
    })
}
