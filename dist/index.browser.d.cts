import { LsonObject, LiveObject, LiveMap, createClient } from '@liveblocks/client';
import { MutationContext } from '@liveblocks/react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import * as _liveblocks_core from '@liveblocks/core';

type ILiveIndexNode<S extends LsonObject = LsonObject> = LiveObject<{
    nodeId: string;
    type: string;
    parentNodeId: string | null;
    parentType: string | null;
    state: LiveObject<S>;
    childNodeSets: LiveMap<string, LiveMap<string, null>>;
}>;
declare class LiveIndexNode<S extends LsonObject = LsonObject> extends LiveObject<ILiveIndexNode<S> extends LiveObject<infer T> ? T : never> {
    constructor(data: {
        nodeId: string;
        type: string;
        parentNodeId: string | null;
        parentType: string | null;
        childNodeSets: LiveMap<string, LiveMap<string, null>>;
        state: LiveObject<S>;
    });
}

type ILiveIndexStorageModel = {
    liveIndex: LiveMap<string, ILiveIndexNode>;
};

type TreeAirNode<T extends string = string, Ext extends Record<string, any> = Record<string, any>, S extends LsonObject = LsonObject, C extends TreeAirNode[] | [] = TreeAirNode<string, Record<string, any>, LsonObject, any>[] | []> = {
    type: T;
    ext: Ext;
    state: S;
    children: C;
};
type ExtractChildTypeUnion<N extends FlatAirNode> = N['childTypeSet'] extends Set<infer CT extends string> ? CT : never;
type FlatAirNode<T extends string = string, S extends LsonObject = LsonObject, CK extends string = string> = {
    type: T;
    state: S;
    childTypeSet: Set<CK>;
};
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
type TreeToNodeUnion<T extends TreeAirNode> = IsEmptyArray<T['children']> extends true ? (FlatAirNode<T['type'], T['state'], never>) : (FlatAirNode<T['type'], T['state'], T['children'][number]['type']>) | ({
    [ChildType in T['children'][number]['type']]: TreeToNodeUnion<(T['children'][number] & {
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
type AirStorageMutationContext = MutationContext<any, ILiveIndexStorageModel, any>;

declare class NodeKey<T extends string = string> {
    nodeId: string;
    type: T;
    constructor(nodeId: string, type: T);
}

type ImmutableLsonObject<T extends FlatAirNode> = ReturnType<LiveIndexNode<T['state']>['toImmutable']>['state'];

declare const configureAirStorage: <U extends FlatAirNode, ExtIndex extends Record<string, any>>(createClientProps: Parameters<typeof createClient>[0], rootAirNode: TreeAirNode) => {
    useCreateNode: <T extends U["type"]>(nodeKey: NodeKey<T>) => <CT extends ExtractChildTypeUnion<U & {
        type: T;
    }>, R extends NodeKey<CT>>(childType: CT, callback?: ((liveIndexNode: LiveIndexNode<(U & {
        type: CT;
    })["state"]>) => void) | undefined) => R;
    useSelectNodeState: <T_1 extends U["type"], R_1>(nodeKey: NodeKey<T_1>, selector: (immutableState: ImmutableLsonObject<U & {
        type: T_1;
    }>) => R_1) => R_1;
    useUpdateNodeState: <T_2 extends U["type"]>(nodeKey: NodeKey<T_2>) => (callback: (liveIndexState: _liveblocks_core.LiveObject<(U & {
        type: T_2;
    })["state"]>) => void) => void;
    useDeleteNode: <T_3 extends U["type"]>(nodeKey: NodeKey<T_3>, callback?: ((liveIndexNode: LiveIndexNode<(U & {
        type: T_3;
    })["state"]>) => void) | undefined) => () => NodeKey<T_3>;
    useChildrenKeys: <T_4 extends U["type"], CT_1 extends ExtractChildTypeUnion<U & {
        type: T_4;
    }>>(nodeKey: NodeKey<T_4>, childType: CT_1) => Set<NodeKey<string>>;
    AirNodeProvider: ({ storageId, children }: {
        storageId: string;
        children: react.ReactNode;
    }) => react_jsx_runtime.JSX.Element;
    useRootAirNode: () => NodeKey<"root">;
    extensionIndex: ExtIndex;
};

declare const extendAirNodeDefinition: <Ext extends Record<string, any>>() => <T extends string = string, S extends LsonObject = LsonObject, C extends [] | TreeAirNode[] = []>(type: T, ext: Ext, defaultInitialState: S, children: C) => TreeAirNode<T, Ext, S, C>;

export { AirNodeIndexedUnion, AirStorageMutationContext, ExtractChildTypeUnion, FlatAirNode, NodeKey$1 as NodeKey, TreeAirNode, TreeToNodeUnion, configureAirStorage, extendAirNodeDefinition };
