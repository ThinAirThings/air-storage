import { LsonObject, LiveObject, LiveMap, createClient } from '@liveblocks/client';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import * as _liveblocks_core from '@liveblocks/core';

type TreeAirNode<T extends string = string, S extends AirNodeState = AirNodeState, C extends TreeAirNode[] | [] = TreeAirNode<string, AirNodeState, any>[] | []> = {
    type: T;
    state: S;
    children: C;
};
type AirNodeState = LsonObject & {
    nodeName: string;
};
type ExtractChildTypeUnion<N extends FlatAirNode> = N['childTypeSet'] extends Set<infer CT extends string> ? CT : never;
type FlatAirNode<T extends string = string, S extends AirNodeState = AirNodeState, CK extends string = string> = {
    type: T;
    state: S;
    childTypeSet: Set<CK>;
};
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
type TreeToUnion<T extends TreeAirNode> = IsEmptyArray<T['children']> extends true ? (FlatAirNode<T['type'], T['state'], never>) : (FlatAirNode<T['type'], T['state'], T['children'][number]['type']>) | ({
    [ChildType in T['children'][number]['type']]: TreeToUnion<(T['children'][number] & {
        type: ChildType;
    })>;
}[T['children'][number]['type']]);
type AirNodeIndexedUnion<U extends TreeAirNode> = {
    [T in U['type']]: (U & {
        type: T;
    });
};
type NodeKey$1<T extends string = string> = {
    nodeId: string;
    type: T;
};

type ILiveIndexNode<S extends AirNodeState = AirNodeState> = LiveObject<{
    nodeId: string;
    type: string;
    parentNodeId: string | null;
    parentType: string | null;
    state: LiveObject<S>;
    childNodeSets: LiveMap<string, LiveMap<string, null>>;
}>;
declare class LiveIndexNode<S extends AirNodeState = AirNodeState> extends LiveObject<ILiveIndexNode<S> extends LiveObject<infer T> ? T : never> {
    constructor(data: {
        nodeId: string;
        type: string;
        parentNodeId: string | null;
        parentType: string | null;
        childNodeSets: LiveMap<string, LiveMap<string, null>>;
        state: LiveObject<S>;
    });
}

declare class MappedUnion<U extends FlatAirNode = FlatAirNode> extends Map<U['type'], U> {
    constructor(unionMap: Array<[U['type'], U]>);
    get<T extends U['type']>(type: T): (U & {
        type: T;
    });
}

declare class NodeKey<T extends string = string> {
    nodeId: string;
    type: T;
    constructor(nodeId: string, type: T);
}

declare const configureAirStorage: <U extends FlatAirNode>(createClientProps: Parameters<typeof createClient>[0], rootAirNode: TreeAirNode) => {
    useCreateNode: <T extends U["type"], CT extends ExtractChildTypeUnion<U & {
        type: T;
    }>>(nodeKey: NodeKey<T>, childType: CT, callback?: ((liveIndexNode: LiveIndexNode<(U & {
        type: T;
    })["state"]>) => void) | undefined) => () => NodeKey<CT>;
    useSelectNodeState: <T_1 extends U["type"]>(nodeKey: NodeKey<T_1>, selector: <R>(immutableIndexNode: {
        nodeId: string;
        type: string;
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<(U & {
            type: T_1;
        })["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<string, _liveblocks_core.LiveMap<string, null>>;
    } extends infer T_2 ? T_2 extends {
        nodeId: string;
        type: string;
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<(U & {
            type: T_1;
        })["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<string, _liveblocks_core.LiveMap<string, null>>;
    } ? T_2 extends _liveblocks_core.LsonObject ? { readonly [K in keyof T_2]: _liveblocks_core.ToImmutable<Exclude<T_2[K], undefined>> | (undefined extends T_2[K] ? T_2[K] & undefined : never); } : T_2 extends _liveblocks_core.Json ? T_2 : never : never : never) => R) => unknown;
    useUpdateNodeState: <T_3 extends U["type"]>(nodeKey: NodeKey<T_3>, callback: (liveIndexState: _liveblocks_core.LiveObject<(U & {
        type: T_3;
    })["state"]>) => void) => () => void;
    useNodeName: (nodeKey: NodeKey<string>) => string;
    useDeleteNode: <T_4 extends U["type"]>(nodeKey: NodeKey<T_4>, callback?: ((liveIndexNode: LiveIndexNode<(U & {
        type: T_4;
    })["state"]>) => void) | undefined) => () => NodeKey<T_4>;
    useChildrenKeys: <T_5 extends U["type"], CT_1 extends ExtractChildTypeUnion<U & {
        type: T_5;
    }>>(nodeKey: NodeKey<T_5>, childType: CT_1) => Set<NodeKey<string>>;
    AirNodeProvider: ({ storageId, children }: {
        storageId: string;
        children: react.ReactNode;
    }) => react_jsx_runtime.JSX.Element;
    useRootAirNode: () => NodeKey<"root">;
    mappedAirNodeUnion: MappedUnion<FlatAirNode>;
};

export { AirNodeIndexedUnion, AirNodeState, ExtractChildTypeUnion, FlatAirNode, NodeKey$1 as NodeKey, TreeAirNode, TreeToUnion, configureAirStorage };
