import { ReactNode } from "react";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "./createNodeKeyFactory.js";



export const defineStaticIndexFactory = <
    U extends FlatAirNode,
>() => <
    K extends Record<string, any>
>(index: {
    [T in U['type']]: {
        Component: ({nodeKey}:{nodeKey: NodeKey<(U&{type: T})>}) => ReactNode
    } & K
}) => index