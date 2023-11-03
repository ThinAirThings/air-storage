import { LsonObject, LiveObject, LiveMap, JsonObject, createClient } from '@liveblocks/client';
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

type TreeAirNode<T extends string = string, Skt extends Record<string, any> = Record<string, any>, S extends LsonObject = LsonObject, C extends TreeAirNode[] | [] = TreeAirNode<string, Record<string, any>, LsonObject, any>[] | []> = {
    type: T;
    struct: Skt;
    state: S;
    children: C;
};
type ExtractChildTypeUnion<N extends FlatAirNode> = N['childTypeSet'] extends Set<infer CT extends string> ? CT : never;
type FlatAirNode<T extends string = string, Skt extends Record<string, any> = Record<string, any>, S extends LsonObject = LsonObject, CK extends string = string> = {
    type: T;
    struct: Skt;
    state: S;
    childTypeSet: Set<CK>;
};
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
type TreeToNodeUnion<T extends TreeAirNode> = IsEmptyArray<T['children']> extends true ? (FlatAirNode<T['type'], T['struct'], T['state'], never>) : (FlatAirNode<T['type'], T['struct'], T['state'], T['children'][number]['type']>) | ({
    [ChildType in T['children'][number]['type']]: TreeToNodeUnion<(T['children'][number] & {
        type: ChildType;
    })>;
}[T['children'][number]['type']]);
type AirNodeIndexedUnion<U extends TreeAirNode> = {
    [T in U['type']]: (U & {
        type: T;
    });
};
type AirStorageMutationContext = MutationContext<any, ILiveIndexStorageModel, any>;

declare class NodeKey<T extends string = string> {
    nodeId: string;
    type: T;
    constructor(nodeId: string, type: T);
}
type INodeKey<T extends string = string> = {
    nodeId: string;
    type: T;
};

type ImmutableLsonObject<T extends FlatAirNode> = ReturnType<LiveIndexNode<T['state']>['toImmutable']>['state'];

declare const configureAirStorage: <U extends FlatAirNode, ExtIndex extends Record<string, any>, LiveblocksPresence extends JsonObject = {}>(createClientProps: Parameters<typeof createClient>[0], rootAirNode: TreeAirNode, liveblocksPresence?: LiveblocksPresence | undefined) => {
    useUpdateMyPresence: () => (patch: Partial<LiveblocksPresence>, options?: {
        addToHistory: boolean;
    } | undefined) => void;
    useSelf: {
        (): _liveblocks_core.User<LiveblocksPresence, _liveblocks_core.BaseUserMeta>;
        <T>(selector: (me: _liveblocks_core.User<LiveblocksPresence, _liveblocks_core.BaseUserMeta>) => T, isEqual?: ((prev: T, curr: T) => boolean) | undefined): T;
    };
    useNodeSet: <P extends {
        nodeId: string;
        type: string;
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<U["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<string, _liveblocks_core.LiveMap<string, null>>;
    } extends infer T_1 ? T_1 extends {
        nodeId: string;
        type: string;
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<U["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<string, _liveblocks_core.LiveMap<string, null>>;
    } ? T_1 extends _liveblocks_core.LsonObject ? { readonly [K in keyof T_1]: _liveblocks_core.ToImmutable<Exclude<T_1[K], undefined>> | (undefined extends T_1[K] ? T_1[K] & undefined : never); } : T_1 extends _liveblocks_core.Json ? T_1 : never : never : never>(predicate: (node: {
        nodeId: string;
        type: string;
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<U["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<string, _liveblocks_core.LiveMap<string, null>>;
    } extends infer T_2 ? T_2 extends {
        nodeId: string;
        type: string;
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<U["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<string, _liveblocks_core.LiveMap<string, null>>;
    } ? T_2 extends _liveblocks_core.LsonObject ? { readonly [K_1 in keyof T_2]: _liveblocks_core.ToImmutable<Exclude<T_2[K_1], undefined>> | (undefined extends T_2[K_1] ? T_2[K_1] & undefined : never); } : T_2 extends _liveblocks_core.Json ? T_2 : never : never : never) => node is P) => Set<NodeKey<P["type"]>>;
    useCreateNode: <T_3 extends U["type"]>(nodeKey: NodeKey<T_3>) => <CT extends ExtractChildTypeUnion<U & {
        type: T_3;
    }>, R extends NodeKey<CT>>(childType: CT, callback?: ((liveIndexNode: LiveIndexNode<(U & {
        type: CT;
    })["state"]>, extensionIndex: ExtIndex[CT]) => void) | undefined) => R;
    useSelectNodeState: <T_4 extends U["type"], R_1>(nodeKey: NodeKey<T_4>, selector: (immutableState: ImmutableLsonObject<U & {
        type: T_4;
    }>, ext: ExtIndex[T_4]) => R_1) => R_1;
    useUpdateNodeState: <T_5 extends U["type"]>(nodeKey: NodeKey<T_5>) => (callback: (liveIndexState: _liveblocks_core.LiveObject<(U & {
        type: T_5;
    })["state"]>, ext: ExtIndex[T_5]) => void) => void;
    useDeleteNode: <T_6 extends U["type"]>(nodeKey: NodeKey<T_6>, callback?: ((liveIndexNode: LiveIndexNode<(U & {
        type: T_6;
    })["state"]>, ext: ExtIndex[T_6]) => void) | undefined) => () => NodeKey<T_6>;
    useChildrenNodeKeys: <T_7 extends U["type"], CT_1 extends ExtractChildTypeUnion<U & {
        type: T_7;
    }>>(nodeKey: NodeKey<T_7>, childType: CT_1) => Set<NodeKey<CT_1>>;
    AirNodeProvider: ({ storageId, children }: {
        storageId: string;
        children: react.ReactNode;
    }) => react_jsx_runtime.JSX.Element;
    useRootAirNode: () => NodeKey<"root">;
    StructureIndex: ExtIndex;
};

declare const defineAirNode: <T extends string = string, Skt extends Record<string, any> = Record<string, any>, S extends LsonObject = LsonObject, C extends [] | TreeAirNode[] = []>(type: T, struct: Skt, defaultInitialState: S, children: C) => TreeAirNode<T, Skt, S, C>;
declare const defineRootAirNode: <C extends TreeAirNode[]>(children: C) => TreeAirNode<"root", {}, {
    nodeName: string;
}, C>;

declare const extendAirNodeDefinition: <Ext extends Record<string, any>>() => <T extends string = string, S extends LsonObject = LsonObject, C extends [] | TreeAirNode[] = []>(type: T, ext: Ext, defaultInitialState: S, children: C) => TreeAirNode<T, Ext, S, C>;
declare const treeToStructureIndex: <Tree extends TreeAirNode>(tree: Tree) => UnionToIntersection<TreeToExtensionUnion<Tree>>;
type IsEmptyRecord<T> = keyof T extends never ? true : false;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type TreeToExtensionUnion<T extends TreeAirNode> = IsEmptyRecord<T['struct']> extends true ? never | ({
    [ChildType in T['children'][number]['type']]: TreeToExtensionUnion<(T['children'][number] & {
        type: ChildType;
    })>;
}[T['children'][number]['type']]) : {
    [type in T['type']]: T['struct'];
} | ({
    [ChildType in T['children'][number]['type']]: TreeToExtensionUnion<(T['children'][number] & {
        type: ChildType;
    })>;
}[T['children'][number]['type']]);
type TreeToExtensionIndex<T extends TreeAirNode> = UnionToIntersection<TreeToExtensionUnion<T>>;

export { AirNodeIndexedUnion, AirStorageMutationContext, ExtractChildTypeUnion, FlatAirNode, ILiveIndexNode, INodeKey, LiveIndexNode, NodeKey, TreeAirNode, TreeToExtensionIndex, TreeToExtensionUnion, TreeToNodeUnion, UnionToIntersection, configureAirStorage, defineAirNode, defineRootAirNode, extendAirNodeDefinition, treeToStructureIndex };
