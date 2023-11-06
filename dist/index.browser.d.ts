import { LiveObject, LiveMap, LsonObject, JsonObject, createClient } from '@liveblocks/client';
import { MutationContext } from '@liveblocks/react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import * as _liveblocks_core from '@liveblocks/core';

type ILiveIndexNode<U extends FlatAirNode = FlatAirNode> = LiveObject<{
    nodeId: string;
    type: U['type'];
    parentNodeId: string | null;
    parentType: string | null;
    state: LiveObject<U['state']>;
    childNodeSets: LiveMap<U['childTypeSet'] extends Set<infer T extends string> ? T : never, LiveMap<string, null>>;
}>;
declare class LiveIndexNode<U extends FlatAirNode = FlatAirNode> extends LiveObject<ILiveIndexNode<U> extends LiveObject<infer U> ? U : never> {
    constructor(data: {
        nodeId: string;
        type: U['type'];
        parentNodeId: string | null;
        parentType: string | null;
        childNodeSets: LiveMap<U['childTypeSet'] extends Set<infer T extends string> ? T : never, LiveMap<string, null>>;
        state: LiveObject<U['state']>;
    });
}

type ILiveIndexStorageModel<U extends FlatAirNode = FlatAirNode> = {
    liveIndex: LiveMap<string, ILiveIndexNode<U>>;
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

declare const createNodeKey: <U extends FlatAirNode, T extends U["type"]>(nodeId: string, type: T) => NodeKey<U, T>;
type NodeKey<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type']> = {
    nodeId: string;
    type: T;
};

type ImmutableLsonObject<U extends FlatAirNode> = ReturnType<LiveIndexNode<U>['toImmutable']>['state'];

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
        type: U["type"];
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<U["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<U["childTypeSet"] extends Set<infer T_1 extends string> ? T_1 : never, _liveblocks_core.LiveMap<string, null>>;
    } extends infer T_2 ? T_2 extends {
        nodeId: string;
        type: U["type"];
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<U["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<U["childTypeSet"] extends Set<infer T_1 extends string> ? T_1 : never, _liveblocks_core.LiveMap<string, null>>;
    } ? T_2 extends _liveblocks_core.LsonObject ? { readonly [K in keyof T_2]: _liveblocks_core.ToImmutable<Exclude<T_2[K], undefined>> | (undefined extends T_2[K] ? T_2[K] & undefined : never); } : T_2 extends _liveblocks_core.Json ? T_2 : never : never : never>(predicate: (node: {
        nodeId: string;
        type: U["type"];
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<U["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<U["childTypeSet"] extends Set<infer T_1 extends string> ? T_1 : never, _liveblocks_core.LiveMap<string, null>>;
    } extends infer T_3 ? T_3 extends {
        nodeId: string;
        type: U["type"];
        parentNodeId: string | null;
        parentType: string | null;
        state: _liveblocks_core.LiveObject<U["state"]>;
        childNodeSets: _liveblocks_core.LiveMap<U["childTypeSet"] extends Set<infer T_1 extends string> ? T_1 : never, _liveblocks_core.LiveMap<string, null>>;
    } ? T_3 extends _liveblocks_core.LsonObject ? { readonly [K_1 in keyof T_3]: _liveblocks_core.ToImmutable<Exclude<T_3[K_1], undefined>> | (undefined extends T_3[K_1] ? T_3[K_1] & undefined : never); } : T_3 extends _liveblocks_core.Json ? T_3 : never : never : never) => node is P) => Set<NodeKey<U, P["type"]>>;
    useUniversalNodeSet: <R>(morphism: (liveIndex: (ILiveIndexStorageModel<U> extends infer T_4 ? T_4 extends ILiveIndexStorageModel<U> ? T_4 extends _liveblocks_core.LsonObject ? { readonly [K_2 in keyof T_4]: _liveblocks_core.ToImmutable<Exclude<T_4[K_2], undefined>> | (undefined extends T_4[K_2] ? T_4[K_2] & undefined : never); } : T_4 extends _liveblocks_core.Json ? T_4 : never : never : never)["liveIndex"]) => R) => R;
    useCreateNode: <T_5 extends U["type"]>(nodeKey: NodeKey<U, T_5>) => <CT extends ExtractChildTypeUnion<U & {
        type: T_5;
    }>, R_1 extends NodeKey<U, CT>>(childType: CT, callback?: ((liveIndexNode: LiveIndexNode<U & {
        type: CT;
    }>, extensionIndex: ExtIndex[CT]) => void) | undefined) => R_1;
    useSelectNodeState: <T_6 extends U["type"], R_2>(nodeKey: NodeKey<U, T_6>, selector: (immutableState: ImmutableLsonObject<U & {
        type: T_6;
    }>, ext: ExtIndex[T_6]) => R_2) => R_2;
    useUpdateNodeState: <T_7 extends U["type"]>(nodeKey: NodeKey<T_7>) => (callback: (liveIndexState: _liveblocks_core.LiveObject<(U & {
        type: T_7;
    })["state"]>, ext: ExtIndex[T_7]) => void) => void;
    useDeleteNode: <T_8 extends U["type"]>(nodeKey: NodeKey<T_8>, callback?: ((liveIndexNode: LiveIndexNode<(U & {
        type: T_8;
    })["state"]>, ext: ExtIndex[T_8]) => void) | undefined) => () => NodeKey<FlatAirNode, string>;
    useChildrenNodeKeys: <T_9 extends U["type"], CT_1 extends ExtractChildTypeUnion<U & {
        type: T_9;
    }>>(nodeKey: NodeKey<U, T_9>, childType: CT_1) => Set<NodeKey<U, CT_1>>;
    AirNodeProvider: ({ storageId, children }: {
        storageId: string;
        children: react.ReactNode;
    }) => react_jsx_runtime.JSX.Element;
    useRootAirNode: () => NodeKey<FlatAirNode, "root">;
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

export { AirNodeIndexedUnion, AirStorageMutationContext, ExtractChildTypeUnion, FlatAirNode, ILiveIndexNode, LiveIndexNode, NodeKey, TreeAirNode, TreeToExtensionIndex, TreeToExtensionUnion, TreeToNodeUnion, UnionToIntersection, configureAirStorage, createNodeKey, defineAirNode, defineRootAirNode, extendAirNodeDefinition, treeToStructureIndex };
