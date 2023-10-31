import { configureAirStorage } from "./configureAirStorage.js";
import { NodeKey } from "./hooks/useAirNode/NodeKey.js";
import { defineAirNodeTree, defineAirNode, TreeToUnion } from "./types.js";



const airNodeTree = defineAirNodeTree([
    defineAirNode('Level1NodeA', {
        stuff: 'stuff',
        name: 5
    }, [
        defineAirNode('Level2NodeA', {}, [
            defineAirNode('Level3NodeA', {}, []),
            defineAirNode('Level3NodeB', {}, []),
            defineAirNode('Level3NodeC', {}, []),
        ]),
        defineAirNode('Level2NodeB', {}, [
            defineAirNode('Level3NodeD', {}, []),
            defineAirNode('Level3NodeE', {}, []),
            defineAirNode('Level3NodeF', {}, []),
        ]),
        defineAirNode('Level2NodeC', {}, [
            defineAirNode('Level3NodeG', {}, []),
            defineAirNode('Level3NodeH', {}, []),
            defineAirNode('Level3NodeI', {}, []),
        ]),
    ]),
    defineAirNode('Level1NodeB', {}, [
        defineAirNode('Level2NodeD', {}, [
            defineAirNode('Level3NodeJ', {}, []),
            defineAirNode('Level3NodeK', {}, []),
            defineAirNode('Level3NodeL', {}, []),
        ]),
        defineAirNode('Level2NodeE', {}, [
            defineAirNode('Level3NodeM', {}, []),
            defineAirNode('Level3NodeN', {}, []),
            defineAirNode('Level3NodeO', {}, []),
        ]),
        defineAirNode('Level2NodeF', {}, [
            defineAirNode('Level3NodeP', {}, []),
            defineAirNode('Level3NodeQ', {}, []),
            defineAirNode('Level3NodeR', {}, []),
        ]),
    ]),
])

type Union = TreeToUnion<typeof airNodeTree>
type Entry = (Union&{type: 'Level1NodeA'})['childTypeSet']

const {useAirNode, useRootAirNode} = configureAirStorage<TreeToUnion<typeof airNodeTree>>(
    null as any,
    airNodeTree
)
const businessNode = useRootAirNode('create')('Level1NodeA')
const createFirstNode = useAirNode(
    new NodeKey('root', 'root'),
    'create'
)

const node = createFirstNode('Level1NodeB', (node) => {

})
const updateState = useAirNode(node, 'update')
updateState((state) => {
    state.set('stuff', 'stuff')
})
const stuff = useAirNode(node, 'useSelect')(node => {
    return node.state.name
})

const createSecondNode = useAirNode(
    node,
    'create'
)

const secondNode = createSecondNode('Level2NodeB')
const children = useAirNode(secondNode, 'useChildren')('Level3NodeD');

[...children].map(nodeKey => nodeKey)
const thirdNode = useAirNode(secondNode, 'create')('Level3NodeD')

const neverNode = useAirNode(thirdNode, 'create')('')


// const stuff = useAirNode(node, 'useSelect')(node => {
//     return node.state.stuff
// })
