import { configureAirStorage } from "./configureAirStorage.js";
import { defineAirNode, defineAirNodeSchema } from "./defineAirNode.js";
import { TreeToStaticIndex } from "./extendAirNodeDefinition.js";
import { TreeToNodeUnion } from "./types.js";


const airNodeTree = defineAirNodeSchema([
    defineAirNode('Level1NodeA', {
        iconLabel: 'stuff'
    }, {
        nodeName: 'Test Node',
        stuff: 'stuff',
        name: 5
    }, [
        defineAirNode('Level2NodeA', {}, {}, [
            defineAirNode('Level3NodeA', {}, {}, []),
            defineAirNode('Level3NodeB', {}, {}, []),
            defineAirNode('Level3NodeC', {}, {}, []),
        ]),
        defineAirNode('Level2NodeB', {}, {}, [
            defineAirNode('Level3NodeD', {}, {}, []),
            defineAirNode('Level3NodeE', {}, {}, []),
            defineAirNode('Level3NodeF', {}, {}, []),
        ]),
        defineAirNode('Level2NodeC', {}, {}, [
            defineAirNode('Level3NodeG', {}, {}, []),
            defineAirNode('Level3NodeH', {}, {}, []),
            defineAirNode('Level3NodeI', {}, {}, []),
        ]),
    ]),
    defineAirNode('Level1NodeB', {}, {}, [
        defineAirNode('Level2NodeD', {}, {}, [
            defineAirNode('Level3NodeJ', {}, {}, []),
            defineAirNode('Level3NodeK', {}, {}, []),
            defineAirNode('Level3NodeL', {}, {}, []),
        ]),
        defineAirNode('Level2NodeE', {}, {}, [
            defineAirNode('Level3NodeM', {}, {}, []),
            defineAirNode('Level3NodeN', {}, {}, []),
            defineAirNode('Level3NodeO', {}, {}, []),
        ]),
        defineAirNode('Level2NodeF', {}, {}, [
            defineAirNode('Level3NodeP', {}, {}, []),
            defineAirNode('Level3NodeQ', {}, {}, []),
            defineAirNode('Level3NodeR', {}, {}, []),
        ]),
    ]),
])

type Union = TreeToNodeUnion<typeof airNodeTree>
type ExtensionIndex = TreeToStaticIndex<typeof airNodeTree>
type Thingy = ExtensionIndex['']
type Entry = (Union&{type: 'Level1NodeA'})['childTypeSet']
type Thing = (Union&{type: 'Level1NodeA'})
const {
    useCreateNode, 
    useRootAirNode, 
    useSelectNodeState,
    useUpdateNodeState,
    extensionIndex
} = configureAirStorage<
    TreeToNodeUnion<typeof airNodeTree>,
    TreeToStaticIndex<typeof airNodeTree>
>(
    null as any,
    airNodeTree
)
extensionIndex['Level2NodeA'].pickles
const rootNode = useRootAirNode()
const createNode = useCreateNode(rootNode)
const level1Node = createNode('Level1NodeA', (node, ext) => node.get('state').set('stuff', 'fdsa'))
const createLevel2 = useCreateNode(level1Node)
const level2NodeA = createLevel2('Level2NodeA')
const level2NodeAUpdater = useUpdateNodeState(level2NodeA)
level2NodeAUpdater((node, ext) => {})
const createLevel3 = useCreateNode(level2NodeA)
const level3NodeA = createLevel3('Level3NodeA')
const updateLevel1Node = useUpdateNodeState(level1Node)
updateLevel1Node((state) => {state.set('stuff', '')})

const data = useSelectNodeState(level1Node, (state) => {
    return state.stuff
})
const updateRootNode = useUpdateNodeState(rootNode)
updateRootNode((state) => state.set('nodeName', 'stuff'))


type NodeA = {
  type: 'NodeA',
  data: {
    val: string
  }
}

type NodeB = {
  type: "NodeB",
  data: {
    other: number
  }
}

type NodeC = {
  type: "NodeC",
  data: {
    fish: number[]
  }
}
type NodeUnion = NodeA | NodeB | NodeC
type Arr = Array<NodeUnion>

const arr: Arr = [
  {type: "NodeA", data: {val: "fsad"}},
  {type: "NodeB", data: {other: 5}}
]

const nodeAPred = (node: NodeUnion): node is NodeA => (node as NodeA).data.val !== undefined
const nodeBPred = (node: NodeUnion): node is NodeB => (node as NodeB).data.other !== undefined
const nodeCPred = (node: NodeUnion): node is NodeC => (node as NodeC).data.fish !== undefined
const first = arr.filter(nodeAPred)
const second = arr.filter(nodeBPred)
const third = arr.filter((node) => (nodeAPred(node) || nodeBPred(node)))

// This defines a function type that takes an array of NodeUnion and returns a boolean
// while also asserting that the array is of type NodeUnion[] (type predicate).
type PredicateFunction = (node: NodeUnion) => node is NodeUnion;

const filterer = <
    PredArray extends Array<(node: NodeUnion) => node is NodeUnion>
>(filters: PredArray): {[Index in keyof PredArray]: PredArray[Index] extends (node: NodeUnion) => node is (infer U extends NodeUnion) ? U : never} => { return null as any}

// Example usage of the filterer function
const result = filterer([
    nodeAPred,
    nodeCPred,
    nodeBPred
    // ... more functions
]);