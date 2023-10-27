import { LiveObject } from "@liveblocks/client";
import { FlattenTree, defineAirNodeSchema, defineAirNodeType } from "./AirNodeTypes/defineAirNodeType.js";
import { configureAirStorage } from "./configureAirStorage.js";



export const testSchema = defineAirNodeSchema([
    defineAirNodeType('Level1NodeA', {
        level1State: 100
    }, () => null as any, [
        defineAirNodeType('Level2NodeA', {
            cheese: 'string'
        }, () => null as any, [
            defineAirNodeType('Level3ANodeA', {}, () => null as any, []),
            defineAirNodeType('Level3ANodeB', {}, () => null as any, [])
        ]),
        // defineAirNodeType('Level2NodeB', {
        //     defaultInitialState: {},
        //     functionSetBuilder: () => null as any
        // }, [
        //     defineAirNodeType('Level3BNodeA', {
        //         defaultInitialState: {},
        //         functionSetBuilder: () => null as any
        //     }, []),
        //     defineAirNodeType('Level3BNodeB', {
        //         defaultInitialState: {},
        //         functionSetBuilder: () => null as any
        //     }, [])
        // ])
    ]),
    // // Adding the Level1NodeB branch
    // defineAirNodeType('Level1NodeB', {
    //     defaultInitialState: {},
    //     functionSetBuilder: () => null as any
    // }, [
    //     defineAirNodeType('Level2NodeX', {
    //         defaultInitialState: {},
    //         functionSetBuilder: () => null as any
    //     }, []),
    //     defineAirNodeType('Level2NodeY', {
    //         defaultInitialState: {},
    //         functionSetBuilder: () => null as any
    //     }, [
    //         defineAirNodeType('Level3YNodeA', {
    //             defaultInitialState: {},
    //             functionSetBuilder: () => null as any
    //         }, []),
    //     ])
    // ])
]);

const {useAirGraph} = configureAirStorage<any, FlattenTree<typeof testSchema>>(
    null as any,
    null as any,
    testSchema
)

const val = useAirGraph({
    nodeId: 'root',
    type: 'root',
}, 'useCreate', 'Level1NodeA')

type SchemaUnion = FlattenTree<typeof testSchema>