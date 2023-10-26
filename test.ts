import {CreateAirNodeType, TreeNode, defineAirNodeSchema, defineAirNodeType} from './src/AirNodeTemplate/createAirNodeTemplate'



const schema2 = defineAirNodeSchema([
    defineAirNodeType('Level1NodeA', [
        defineAirNodeType('Level2NodeA', [
            defineAirNodeType('Level3ANodeA', [
                defineAirNodeType('Level4ANodeA', [
                    defineAirNodeType('Level5ANodeA', [
                        defineAirNodeType('Level6ANodeA', [])
                    ])
                ])
            ]),
            defineAirNodeType('Level3ANodeB', [])
        ]),
        defineAirNodeType('Level2NodeB', [
            defineAirNodeType('Level3BNodeA', []),
            defineAirNodeType('Level3BNodeB', [])
        ])
    ]),
    // Adding the Level1NodeB branch
    defineAirNodeType('Level1NodeB', [
        defineAirNodeType('Level2NodeX', [
            defineAirNodeType('Level3XNodeA', [
                defineAirNodeType('Level4XNodeA', [
                    defineAirNodeType('Level5XNodeA', [])
                ])
            ]),
            defineAirNodeType('Level3XNodeB', [
                defineAirNodeType('Level4XNodeB', [])
            ])
        ]),
        defineAirNodeType('Level2NodeY', [
            defineAirNodeType('Level3YNodeA', []),
            defineAirNodeType('Level3YNodeB', [
                defineAirNodeType('Level4YNodeA', [])
            ])
        ])
    ])
]);

const simpleSchema = defineAirNodeType('root', [
    defineAirNodeType('Level1NodeA', [])
])
type SimpleUnion = CreateAirNodeType<typeof simpleSchema>

type UnionFromSchema = CreateAirNodeType<typeof schema>
type UnionFromSchema2 = CreateAirNodeType<typeof schema2>
type Check = (UnionFromSchema2&{type: 'Level1NodeA'})
type Level1NodeAType = typeof Level1NodeA//['childTypes']['0']['childTypes']['0']['childTypes']['0']['childTypes']['0']['childTypes']['0']['type']
type UnionFromFn = CreateAirNodeType<typeof Level1NodeA>
type AirNodeTypes = UnionFromFn['type']
type Thing = (Union & {type: 'Level1NodeA'})
type Tree = TreeNode<'Level1NodeA', [
    TreeNode<'Level2NodeA', [
        TreeNode<'Level3ANodeA', [
            TreeNode<'Level4ANodeA', [
                TreeNode<'Level5ANodeA', [
                    TreeNode<'Level6ANodeA', []>
                ]>
            ]>
        ]>,
        TreeNode<'Level3ANodeB', []>
    ]>,
    TreeNode<'Level2NodeB', [
        TreeNode<'Level3BNodeA', []>,
        TreeNode<'Level3BNodeB', []>
    ]>
]>
type TreeAlias = Tree
type Union = CreateAirNodeType<Tree>
type CustomName = Thing['type']