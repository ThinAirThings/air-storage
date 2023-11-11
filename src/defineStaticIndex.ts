import { FC, ReactNode } from "react";
import { NodeKey } from "./index.browser.js";
import { FlatAirNode } from "./types.js";



export const defineStaticIndex = <
    U extends FlatAirNode,
    T extends Record<string, any>
>(
    index: {
        [K in U['type']]: {
            Component: (nodeKey: NodeKey<U, K>) => ReactNode
        }
    }
) => index