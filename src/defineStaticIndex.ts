import { FC, ReactNode } from "react";
import { NodeKey } from "./index.browser.js";
import { FlatAirNode } from "./types.js";



export const defineStaticIndex = <
    U extends FlatAirNode,
    K extends Record<string, any>
>(index: {
    [T in U['type']]: {
        Component: ({nodeKey}:{nodeKey: NodeKey<(U&{type: T}), T>}) => ReactNode
    } & K
}) => index