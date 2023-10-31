import { AirNodeState, TreeAirNode } from "./types.js"


export const defineAirNode = <
    T extends string=string,
    S extends AirNodeState=AirNodeState,
    C extends TreeAirNode[]|[]=[]
>(
    type: T,
    defaultInitialState: S,
    children: C
) => ({
    type,
    state: defaultInitialState,
    children: children??[]
}) as TreeAirNode<T, S, C>

export const defineRootAirNode = <
    C extends TreeAirNode[]
>(
    children: C
) => defineAirNode('root', {nodeName: 'root'}, children)

