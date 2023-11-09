import { LsonObject, LiveObject, LiveMap, JsonObject, createClient } from '@liveblocks/client';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import * as _liveblocks_core from '@liveblocks/core';

declare const createNodeKey: <U extends FlatAirNode, T extends U["type"]>({ nodeId, type }: {
    nodeId: string;
    type: T;
}) => NodeKey<U, T>;
type NodeKey<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type']> = {
    nodeId: string;
    type: T;
};

type TreeAirNode<T extends string = string, Skt extends Record<string, any> = Record<string, any>, S extends LsonObject = LsonObject, C extends TreeAirNode[] | [] = TreeAirNode<string, Record<string, any>, LsonObject, any>[] | []> = {
    type: T;
    struct: Skt;
    state: S;
    children: C;
};
type FlatAirNode<T extends string = string, Skt extends Record<string, any> = Record<string, any>, S extends LsonObject = LsonObject, CK extends string = string> = {
    type: T;
    struct: Skt;
    state: S;
    childTypeSet: CK;
};
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
type TreeToNodeUnion<T extends TreeAirNode> = IsEmptyArray<T['children']> extends true ? (FlatAirNode<T['type'], T['struct'], T['state'], never>) : (T['type'] extends 'root' ? never : (FlatAirNode<T['type'], T['struct'], T['state'], T['children'][number]['type']>)) | ({
    [ChildType in T['children'][number]['type']]: TreeToNodeUnion<(T['children'][number] & {
        type: ChildType;
    })>;
}[T['children'][number]['type']]);
type AirNodeIndexedUnion<U extends TreeAirNode> = {
    [T in U['type']]: (U & {
        type: T;
    });
};
type AirPresence<U extends FlatAirNode> = {
    nodeKeySelection: Array<NodeKey<U>>;
    focusedNodeKey: NodeKey<U> | null;
};

type ILiveIndexNode<U extends FlatAirNode = FlatAirNode> = LiveObject<{
    nodeId: string;
    type: U['type'];
    parentNodeId: string | null;
    parentType: string | null;
    state: LiveObject<U['state']>;
    childNodeKeyMap: LiveMap<string, NodeKey<U & {
        type: U['childTypeSet'];
    }>>;
}>;
declare class LiveIndexNode<U extends FlatAirNode = FlatAirNode> extends LiveObject<ILiveIndexNode<U> extends LiveObject<infer U> ? U : never> {
    constructor(data: {
        nodeId: string;
        type: U['type'];
        parentNodeId: string | null;
        parentType: string | null;
        childNodeKeyMap: LiveMap<string, NodeKey<U & {
            type: U['childTypeSet'];
        }>>;
        state: LiveObject<U['state']>;
    });
}

type ILiveIndexStorageModel<U extends FlatAirNode = FlatAirNode> = {
    liveIndex: LiveMap<string, ILiveIndexNode<U>>;
};

type ImmutableLsonObject<U extends FlatAirNode> = ReturnType<LiveIndexNode<U>['toImmutable']>['state'];

declare const configureAirStorage: <U extends FlatAirNode, StaticIndex extends Record<string, any>, P extends JsonObject = {}>(createClientProps: Parameters<typeof createClient>[0], rootAirNode: TreeAirNode, liveblocksPresence?: P | undefined) => {
    useUpdateMyPresence: () => (patch: Partial<AirPresence<U> & P>, options?: {
        addToHistory: boolean;
    } | undefined) => void;
    useSelf: {
        (): _liveblocks_core.User<AirPresence<U> & P, _liveblocks_core.BaseUserMeta>;
        <T>(selector: (me: _liveblocks_core.User<AirPresence<U> & P, _liveblocks_core.BaseUserMeta>) => T, isEqual?: ((prev: T, curr: T) => boolean) | undefined): T;
    };
    useNodeSet: <R>(morphism: (liveIndex: (ILiveIndexStorageModel<U> extends infer T_1 ? T_1 extends ILiveIndexStorageModel<U> ? T_1 extends _liveblocks_core.LsonObject ? { readonly [K in keyof T_1]: _liveblocks_core.ToImmutable<Exclude<T_1[K], undefined>> | (undefined extends T_1[K] ? T_1[K] & undefined : never); } : T_1 extends _liveblocks_core.Json ? T_1 : never : never : never)["liveIndex"]) => R) => R;
    useCreateNode: () => <T_2 extends U["type"], CT extends (U & {
        type: T_2;
    })["childTypeSet"], R_1 extends NodeKey<U & {
        type: CT;
    }>>(nodeKey: NodeKey<U, T_2>, childType: CT, callback?: ((liveIndexNode: LiveIndexNode<U & {
        type: CT;
    }>) => void) | undefined) => R_1;
    useSelectNodeState: <T_3 extends U["type"], R_2>(nodeKey: NodeKey<U, T_3>, selector: (immutableState: ImmutableLsonObject<U & {
        type: T_3;
    }>) => R_2) => R_2;
    useUpdateNodeState: () => <T_4 extends U["type"]>(nodeKey: NodeKey<U, T_4>, callback: (liveIndexState: _liveblocks_core.LiveObject<(U & {
        type: T_4;
    })["state"]>) => void) => void;
    useDeleteNode: () => <T_5 extends U["type"]>(nodeKey: NodeKey<U, T_5>, callback?: ((liveIndexNode: LiveIndexNode<U & {
        type: T_5;
    }>) => void) | undefined) => NodeKey<U, T_5>;
    AirNodeProvider: ({ storageId, children }: {
        storageId: string;
        children: react.ReactNode;
    }) => react_jsx_runtime.JSX.Element;
    useSelfNodeKeySelection: () => NodeKey<U>[];
    useSelfNodeKeySelectionUpdate: () => (updater: (nodeKeySelection: NodeKey<U>[]) => NodeKey<U>[]) => void;
    useSelfNodeKeySelectionAdd: () => (nodeKey: NodeKey<U>) => boolean;
    useSelfNodeKeySelectionRemove: () => (nodeKey: NodeKey<U>) => boolean;
    useSelfFocusedNodeKey: () => NodeKey<U> | null;
    useSelfFocusedNodeKeyUpdate: () => (nodeKey: NodeKey<U> | null) => boolean;
    StaticIndex: StaticIndex;
};

declare const defineAirNode: <T extends string = string, Skt extends Record<string, any> = Record<string, any>, S extends LsonObject = LsonObject, C extends [] | TreeAirNode[] = []>(type: T, struct: Skt, defaultInitialState: S, children: C) => TreeAirNode<T, Skt, S, C>;
declare const defineAirNodeSchema: <C extends TreeAirNode[]>(children: C) => TreeAirNode<"root", {}, {}, C>;

declare const treeToStructureIndex: <Tree extends TreeAirNode>(tree: Tree) => UnionToIntersection<TreeToStaticUnion<Tree>>;
type IsEmptyRecord<T> = keyof T extends never ? true : false;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type TreeToStaticUnion<T extends TreeAirNode> = IsEmptyRecord<T['struct']> extends true ? never | ({
    [ChildType in T['children'][number]['type']]: TreeToStaticUnion<(T['children'][number] & {
        type: ChildType;
    })>;
}[T['children'][number]['type']]) : {
    [type in T['type']]: T['struct'];
} | ({
    [ChildType in T['children'][number]['type']]: TreeToStaticUnion<(T['children'][number] & {
        type: ChildType;
    })>;
}[T['children'][number]['type']]);
type TreeToStaticIndex<T extends TreeAirNode> = UnionToIntersection<TreeToStaticUnion<T>>;

export { AirNodeIndexedUnion, AirPresence, FlatAirNode, ILiveIndexNode, LiveIndexNode, NodeKey, TreeAirNode, TreeToNodeUnion, TreeToStaticIndex, TreeToStaticUnion, UnionToIntersection, configureAirStorage, createNodeKey, defineAirNode, defineAirNodeSchema, treeToStructureIndex };
