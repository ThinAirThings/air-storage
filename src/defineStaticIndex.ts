import { FlatAirNode } from "./types.js";



export const defineStaticIndex = <
    U extends FlatAirNode,
    T extends Record<string, any>
>(index: Record<U['type'], T>) => index