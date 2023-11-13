import { ReactNode } from "react";
import { FlatAirNode } from "../types.js";
import { NodeKey } from "./createNodeKeyFactory.js";



export const defineStaticIndexFactory = <
    U extends FlatAirNode,
>() => <
    D extends Record<string, any>
>(index: {
    [T in U['type']]: {
        Component: ({nodeKey}:{nodeKey: NodeKey<(U&{type: T})>}) => ReactNode
    } & D
}) => new StaticIndex<U['type'], {
    [T in U['type']]: {
        Component: ({nodeKey}:{nodeKey: NodeKey<(U&{type: T})>}) => ReactNode
    } & D
}>(index)

class StaticIndex<
    K extends string,
    D extends Record<string, any>
> extends Map<K, D> {
    constructor(index: Record<K, D>){
        super(Object.entries(index) as [K, D][])
    }
    get<T extends K>(type: T): D{
        return super.get(type) as D
    }
}