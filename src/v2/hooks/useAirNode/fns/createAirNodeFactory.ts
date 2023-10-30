import { LiveIndexNode } from "../../../LiveObjects/LiveIndexNode.js"
import { LiveblocksHooks } from "../../../LiveObjects/LiveIndexStorageModel.js"
import { ExtractChildTypeUnion, FlatAirNode } from "../../../types.js"
import {v4 as uuidv4} from 'uuid'
import { MappedUnion } from "../../../types/MappedUnion.js"
import { LiveMap, LiveObject } from "@liveblocks/client"
import { NodeKey } from "../NodeKey.js"



export type AirNodeCreate<
    U extends FlatAirNode=FlatAirNode, 
    T extends U['type']=U['type'],
> = <
    CT extends ExtractChildTypeUnion<(U&{type: T})>
>(childType: CT, callback?:(liveIndexNode: LiveIndexNode<(U&{type: CT})['state']>) => void)=> NodeKey<CT>

export const createAirNodeFactory = (
    useMutation: LiveblocksHooks['useMutation'],
    mappedAirNodeUnion: MappedUnion
) => (
    nodeKey: NodeKey
) => useMutation((
    {storage},
    childType: string,
    callback?: (liveIndexNode: LiveIndexNode) => void
) => {
    const nodeId = uuidv4()
    const newLiveIndexNode = new LiveIndexNode({
        nodeId,
        type: childType,
        parentNodeId: nodeKey.nodeId,
        parentType: nodeKey.type,
        state: new LiveObject(mappedAirNodeUnion.get(childType).state),
        childNodeSets: new LiveMap(
            [...mappedAirNodeUnion.get(childType).childTypeSet]
            .map(childType => [childType, new LiveMap()])
        )
    })
    callback?.(newLiveIndexNode)
    storage.get('liveIndex').get(nodeKey.nodeId)!.get('childNodeSets').get(childType)!.set(nodeId, null)
    storage.get('liveIndex').set(nodeId, newLiveIndexNode)
    return new NodeKey(nodeId, childType)
}, [])
    