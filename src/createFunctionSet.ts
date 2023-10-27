import { JsonObject, LiveMap, LiveObject, LsonObject } from "@liveblocks/client"
import { LiveIndexNode } from "./LiveObjects/LiveIndexNode.js"
import { createRoomContext } from "@liveblocks/react"
import { ILiveIndexStorageModel } from "./LiveObjects/LiveIndexStorageModel.js"
import { AirNodeType, ExtractChildTypes, ExtractState, NodeKey } from "./AirNodeTypes/defineAirNodeType.js"
import {v4 as uuidv4} from 'uuid'

export type LiveblocksHooks = ReturnType<typeof createRoomContext<any, ILiveIndexStorageModel>>['suspense']

export type BaseFunctionSetProps<
    State extends LsonObject=LsonObject,
> = {
    defaultInitialState: State,
    functionSetBuilder?: () => {
        create: (liveIndexNode: LiveIndexNode<State>, initialState?: State) => void,
        storage: (immutableIndexNode: ReturnType<LiveIndexNode<State>['toImmutable']>, key: keyof State) => State[keyof State],
        mutate: (liveIndexNode: LiveIndexNode<State>, key: keyof State, value: State[keyof State]) => void,
        delete: (liveIndexNode: LiveIndexNode<State>) => void
    }
}

export type FunctionSet<U extends AirNodeType, T extends U['type']> = {
    useCreate: (nodeKey: NodeKey<T>) => <CT extends ExtractChildTypes<U, T>>
        (childType: CT, initialState?: ExtractState<U, CT>) => NodeKey<CT>,
    useStorage: (nodeKey: NodeKey<T>) => <K extends keyof ExtractState<U, T>>(stateKey: K) => ExtractState<U, T>[K],
    useMutation: (nodeKey: NodeKey<T>) => <K extends keyof ExtractState<U, T>>(stateKey: K, value: ExtractState<U, T>[K]) => void,
    useDelete: (nodeKey: NodeKey<T>) => () => void
}

export const createFunctionSet = <U extends AirNodeType, T extends U['type']>(
    defaultInitialState: LsonObject, 
    builder: BaseFunctionSetProps['functionSetBuilder'],
    liveblocksHooks: LiveblocksHooks,
    childTypeSet: Set<string>
): FunctionSet<U, T> => {
        const customFunctionSet = builder!()
        const composedFunctionSet: FunctionSet<U, T> = {
            useCreate: (nodeKey) => {
                return liveblocksHooks.useMutation(({storage}, type: T, initialState?: ExtractState<U,T>) => {
                    const nodeId = uuidv4()
                    const liveIndexNode = new LiveIndexNode({
                        nodeId: '',
                        type,
                        parentNodeId: nodeKey.nodeId,
                        parentType: nodeKey.type,
                        state: new LiveObject(initialState??defaultInitialState),
                        childNodeSets: new LiveMap([...childTypeSet].map(childType => [childType, new LiveMap()]))
                    })
                    customFunctionSet.create(liveIndexNode, initialState)   // Run declared create function
                    const liveIndex = storage.get('liveIndex')
                    liveIndex.get(nodeKey.nodeId)!.get('childNodeSets')!.get(type)!.set(nodeId, null)   // Set Parent
                    liveIndex.set(nodeId, liveIndexNode)         // Set Self
                    return {
                        type,
                        nodeId
                    }
                }, []) as <CT extends ExtractChildTypes<U, T>>(type: CT, initialState?: ExtractState<U,CT>) => NodeKey<CT>
            },
            useStorage: (nodeKey) => (stateKey) => liveblocksHooks.useStorage(({liveIndex}) => {
                return customFunctionSet.storage(liveIndex.get(nodeKey.nodeId)!.state as any, stateKey as string) as any
            }),
            useMutation: (nodeKey) => {
                return liveblocksHooks.useMutation(({storage}, stateKey: keyof JsonObject, value: JsonObject[keyof JsonObject]) => {
                    customFunctionSet.mutate(storage.get('liveIndex').get(nodeKey.nodeId)!, stateKey, value)
                },[]) as <K extends keyof ExtractState<U, T>>(key: K, value: ExtractState<U, T>[K]) => void
            },
            useDelete: (nodeKey) => () => {
                return liveblocksHooks.useMutation(({storage}) => {
                    // Pass control to declared delete function
                    customFunctionSet.delete(storage.get('liveIndex').get(nodeKey.nodeId)!)
                    // Perform general index cleanup
                    const liveIndex = storage.get('liveIndex')
                    const thisNode = liveIndex.get(nodeKey.nodeId)!
                    const parentNode = liveIndex.get(thisNode.get('parentNodeId')!)!
                    // Delete children
                    const deleteChildren = (node: LiveIndexNode) => {
                        node.get('childNodeSets')!.forEach(childNodeSet => {
                            childNodeSet.forEach((_, childNodeId) => {
                                liveIndex.delete(childNodeId)
                                deleteChildren(liveIndex.get(childNodeId)!)
                            })
                        })
                    }
                    deleteChildren(thisNode)
                    // Delete self
                    liveIndex.delete(nodeKey.nodeId)
                    // Delete self from parent
                    parentNode.get('childNodeSets')!.get(nodeKey.type)!.delete(nodeKey.nodeId)
                },[]) as () => void
            }
        }
        return composedFunctionSet
    }