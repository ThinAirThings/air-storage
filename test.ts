import {FlattenTree, TreeNode, defineAirNodeSchema, defineAirNodeType} from './src/AirNodeTemplate/defineAirNodeType'
import {TypedTreeMap} from './src/structures/TypedTreeMap'
import {configureStorage} from './src/configureStorage'


// export const testSchema = defineAirNodeSchema([
//     defineAirNodeType('Level1NodeA', [
//         defineAirNodeType('Level2NodeA',  [
//             defineAirNodeType('Level3ANodeA',  [
//                 defineAirNodeType('Level4ANodeA',  [
//                     defineAirNodeType('Level5ANodeA',  [
//                         defineAirNodeType('Level6ANodeA',  [])
//                     ])
//                 ])
//             ]),
//             defineAirNodeType('Level3ANodeB',  [])
//         ]),
//         defineAirNodeType('Level2NodeB',  [
//             defineAirNodeType('Level3BNodeA', []),
//             defineAirNodeType('Level3BNodeB',  [])
//         ])
//     ]),
//     // Adding the Level1NodeB branch
//     defineAirNodeType('Level1NodeB', [
//         defineAirNodeType('Level2NodeX', [
//             defineAirNodeType('Level3XNodeA', [
//                 defineAirNodeType('Level4XNodeA', [
//                     defineAirNodeType('Level5XNodeA', [])
//                 ])
//             ]),
//             defineAirNodeType('Level3XNodeB',  [
//                 defineAirNodeType('Level4XNodeB', [])
//             ])
//         ]),
//         defineAirNodeType('Level2NodeY', [
//             defineAirNodeType('Level3YNodeA', []),
//             defineAirNodeType('Level3YNodeB',  [
//                 defineAirNodeType('Level4YNodeA',  [])
//             ])
//         ])
//     ])
// ]);

export const testSchema = defineAirNodeSchema([
    defineAirNodeType('Level1NodeA', {
        metadata: {
            name: 'Level1NodeA'
        }
    }, [
        defineAirNodeType('Level2NodeA',  {}, [
            defineAirNodeType('Level3ANodeA', {}, [
                defineAirNodeType('Level4ANodeA', {}, [
                    defineAirNodeType('Level5ANodeA', {}, [
                        defineAirNodeType('Level6ANodeA', {}, [])
                    ])
                ])
            ]),
            defineAirNodeType('Level3ANodeB', {}, [])
        ]),
        defineAirNodeType('Level2NodeB', {}, [
            defineAirNodeType('Level3BNodeA', {}, []),
            defineAirNodeType('Level3BNodeB', {}, [])
        ])
    ]),
    // Adding the Level1NodeB branch
    defineAirNodeType('Level1NodeB', {}, [
        defineAirNodeType('Level2NodeX', {}, [
            defineAirNodeType('Level3XNodeA', {}, [
                defineAirNodeType('Level4XNodeA', {}, [
                    defineAirNodeType('Level5XNodeA', {}, [])
                ])
            ]),
            defineAirNodeType('Level3XNodeB', {}, [
                defineAirNodeType('Level4XNodeB', {}, [])
            ])
        ]),
        defineAirNodeType('Level2NodeY', {}, [
            defineAirNodeType('Level3YNodeA', {}, []),
            defineAirNodeType('Level3YNodeB',  {}, [
                defineAirNodeType('Level4YNodeA',  {}, [])
            ])
        ])
    ])
]);

const testStorage = configureStorage<FlattenTree<typeof testSchema>>(testSchema) 

type UnionFromSchema2 = FlattenTree<typeof testSchema>

const newMap = new TypedTreeMap<FlattenTree<typeof testSchema>>(testSchema)

const val = newMap.get(
    ''
).childTypes