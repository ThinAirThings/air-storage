import { configureAirStorage } from "./configureAirStorage.js";
import { NodeKey } from "./types/NodeKey.js";
import { defineAirNode, defineRootAirNode } from "./defineAirNode.js";
import { TreeToExtensionIndex, UnionToIntersection, extendAirNodeDefinition } from "./extendAirNodeDefinition.js";
import { TreeToNodeUnion } from "./types.js";


const defineDirectoryAirNode = extendAirNodeDefinition<{
    iconLabel: string
}>()
const defineOtherAirNode = extendAirNodeDefinition<{
    pickles: number
}>()
const airNodeTree = defineRootAirNode([
    defineDirectoryAirNode('Level1NodeA', {
        iconLabel: 'stuff'
    }, {
        nodeName: 'Test Node',
        stuff: 'stuff',
        name: 5
    }, [
        defineOtherAirNode('Level2NodeA', {pickles: 10}, {}, [
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
type ExtensionIndex = TreeToExtensionIndex<typeof airNodeTree>
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
    TreeToExtensionIndex<typeof airNodeTree>
>(
    null as any,
    airNodeTree
)
extensionIndex['Level2NodeA'].pickles
const rootNode = useRootAirNode()
const createNode = useCreateNode(rootNode)
const level1Node = createNode('Level1NodeA', (node) => node.get('state').set('stuff', 'fdsa'))
const createLevel2 = useCreateNode(level1Node)
const level2NodeA = createLevel2('Level2NodeA')
const createLevel3 = useCreateNode(level2NodeA)
const level3NodeA = createLevel3('Level3NodeA')
const updateLevel1Node = useUpdateNodeState(level1Node)
updateLevel1Node((state) => {state.set('stuff', '')})

const data = useSelectNodeState(level1Node, (state) => {
    return state.stuff
})
const updateRootNode = useUpdateNodeState(rootNode)
updateRootNode((state) => state.set('nodeName', 'stuff'))


