import { LsonObject, LiveObject, LiveMap, JsonObject, createClient } from '@liveblocks/client';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { FC } from 'react';
import * as _liveblocks_core from '@liveblocks/core';

type NodeKey<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type']> = {
    nodeId: string;
    type: T;
};

type TreeAirNode<T extends string = string, S extends LsonObject = LsonObject, C extends TreeAirNode[] | [] = TreeAirNode<string, LsonObject, any>[] | []> = {
    type: T;
    state: S;
    children: C;
};
type FlatAirNode<T extends string = string, S extends LsonObject = LsonObject, CK extends string = string> = {
    type: T;
    state: S;
    childTypeSet: CK;
};
type IsEmptyArray<T extends any[]> = T['length'] extends 0 ? true : false;
type TreeToNodeUnion<T extends TreeAirNode> = IsEmptyArray<T['children']> extends true ? (FlatAirNode<T['type'], T['state'], never>) : (T['type'] extends 'root' ? never : (FlatAirNode<T['type'], T['state'], T['children'][number]['type']>)) | ({
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

declare const configureStorage: <U extends FlatAirNode, P extends JsonObject = {}>(createClientProps: Parameters<typeof createClient>[0], airNodeSchema: TreeAirNode, liveblocksPresence?: P | undefined) => {
    useUpdateMyPresence: () => (patch: Partial<AirPresence<U> & P>, options?: {
        addToHistory: boolean;
    } | undefined) => void;
    useSelf: {
        (): _liveblocks_core.User<AirPresence<U> & P, _liveblocks_core.BaseUserMeta>;
        <T>(selector: (me: _liveblocks_core.User<AirPresence<U> & P, _liveblocks_core.BaseUserMeta>) => T, isEqual?: ((prev: T, curr: T) => boolean) | undefined): T;
    };
    useRoom: () => _liveblocks_core.Room<AirPresence<U>, ILiveIndexStorageModel<U>, _liveblocks_core.BaseUserMeta, never>;
    useStorage: <T_1>(selector: (root: ILiveIndexStorageModel<U> extends infer T_2 ? T_2 extends ILiveIndexStorageModel<U> ? T_2 extends _liveblocks_core.LsonObject ? { readonly [K in keyof T_2]: _liveblocks_core.ToImmutable<Exclude<T_2[K], undefined>> | (undefined extends T_2[K] ? T_2[K] & undefined : never); } : T_2 extends _liveblocks_core.Json ? T_2 : never : never : never) => T_1, isEqual?: ((prev: T_1, curr: T_1) => boolean) | undefined) => T_1;
    RoomContext: react.Context<_liveblocks_core.Room<AirPresence<U>, ILiveIndexStorageModel<U>, _liveblocks_core.BaseUserMeta, never> | null>;
    useNodeSet: <R>(morphism: (liveIndex: (ILiveIndexStorageModel<U> extends infer T_3 ? T_3 extends ILiveIndexStorageModel<U> ? T_3 extends _liveblocks_core.LsonObject ? { readonly [K_1 in keyof T_3]: _liveblocks_core.ToImmutable<Exclude<T_3[K_1], undefined>> | (undefined extends T_3[K_1] ? T_3[K_1] & undefined : never); } : T_3 extends _liveblocks_core.Json ? T_3 : never : never : never)["liveIndex"]) => R) => R;
    useCreateNode: () => <T_4 extends U["type"], CT extends (U & {
        type: T_4;
    })["childTypeSet"] extends never ? U["type"] : (U & {
        type: T_4;
    })["childTypeSet"], R_1 extends NodeKey<U & {
        type: CT;
    }>>(parentNodeKey: NodeKey<U, T_4> | null, childType: CT, callback?: ((liveIndexNode: LiveIndexNode<U & {
        type: CT;
    }>) => void) | undefined) => R_1;
    useSelectNodeState: <T_5 extends U["type"], R_2>(nodeKey: NodeKey<U, T_5>, selector: (immutableState: ImmutableLsonObject<U & {
        type: T_5;
    }>) => R_2) => R_2;
    useUpdateNodeState: () => <T_6 extends U["type"]>(nodeKey: NodeKey<U, T_6>, callback: (liveIndexState: _liveblocks_core.LiveObject<(U & {
        type: T_6;
    })["state"]>) => void) => void;
    useDeleteNode: () => <T_7 extends U["type"]>(nodeKey: NodeKey<U, T_7>, callback?: ((liveIndexNode: LiveIndexNode<U & {
        type: T_7;
    }>) => void) | undefined) => NodeKey<U, T_7>;
    AirStorageProvider: ({ storageId, children }: {
        storageId: string;
        children: react.ReactNode;
    }) => react_jsx_runtime.JSX.Element;
    useSelfNodeKeySelection: () => NodeKey<U>[];
    useSelfNodeKeySelectionUpdate: () => (updater: (nodeKeySelection: NodeKey<U>[]) => NodeKey<U>[]) => void;
    useSelfNodeKeySelectionAdd: () => (nodeKey: NodeKey<U>) => boolean;
    useSelfNodeKeySelectionRemove: () => (nodeKey: NodeKey<U>) => boolean;
    useSelfFocusedNodeKey: () => NodeKey<U> | null;
    useSelfFocusedNodeKeyUpdate: () => (nodeKey: NodeKey<U> | null) => boolean;
    defineStaticIndex: <D extends Record<string, any>>(index: { [T_8 in U["type"]]: {
        Component: ({ nodeKey }: {
            nodeKey: NodeKey<U & {
                type: T_8;
            }>;
        }) => react.ReactNode;
    } & D; }) => {
        get<T_9 extends U["type"]>(type: T_9): { [T_10 in U["type"]]: {
            Component: ({ nodeKey }: {
                nodeKey: NodeKey<U & {
                    type: T_10;
                }>;
            }) => react.ReactNode;
        } & D; }[T_9];
        clear(): void;
        delete(key: U["type"]): boolean;
        forEach(callbackfn: (value: { [T_10 in U["type"]]: {
            Component: ({ nodeKey }: {
                nodeKey: NodeKey<U & {
                    type: T_10;
                }>;
            }) => react.ReactNode;
        } & D; }[U["type"]], key: U["type"], map: Map<U["type"], { [T_10 in U["type"]]: {
            Component: ({ nodeKey }: {
                nodeKey: NodeKey<U & {
                    type: T_10;
                }>;
            }) => react.ReactNode;
        } & D; }[U["type"]]>) => void, thisArg?: any): void;
        has(key: U["type"]): boolean;
        set(key: U["type"], value: { [T_10 in U["type"]]: {
            Component: ({ nodeKey }: {
                nodeKey: NodeKey<U & {
                    type: T_10;
                }>;
            }) => react.ReactNode;
        } & D; }[U["type"]]): any;
        readonly size: number;
        entries(): IterableIterator<[U["type"], { [T_10 in U["type"]]: {
            Component: ({ nodeKey }: {
                nodeKey: NodeKey<U & {
                    type: T_10;
                }>;
            }) => react.ReactNode;
        } & D; }[U["type"]]]>;
        keys(): IterableIterator<U["type"]>;
        values(): IterableIterator<{ [T_10 in U["type"]]: {
            Component: ({ nodeKey }: {
                nodeKey: NodeKey<U & {
                    type: T_10;
                }>;
            }) => react.ReactNode;
        } & D; }[U["type"]]>;
        [Symbol.iterator](): IterableIterator<[U["type"], { [T_10 in U["type"]]: {
            Component: ({ nodeKey }: {
                nodeKey: NodeKey<U & {
                    type: T_10;
                }>;
            }) => react.ReactNode;
        } & D; }[U["type"]]]>;
        readonly [Symbol.toStringTag]: string;
    };
    createNodeKey: <T_11 extends U["type"]>({ nodeId, type }: {
        nodeId: string;
        type: T_11;
    }) => NodeKey<U, T_11>;
};

declare const defineAirNode: <T extends string = string, S extends LsonObject = LsonObject, C extends [] | TreeAirNode[] = []>(type: T, defaultInitialState: S, children: C) => TreeAirNode<T, S, C>;
declare const defineAirNodeSchema: <C extends TreeAirNode[]>(children: C) => TreeAirNode<"root", {}, C>;

type AuthenticationConfig = {
    authenticationApiBaseUrl: string;
    oauthEndpoint: string;
    clientId: string;
    grantTokenRedirectBasename: string;
    Loading: FC;
};
declare const configureAuthentication: (config: AuthenticationConfig) => {
    AirAuthenticationProvider: ({ children }: {
        children: react.ReactNode;
    }) => react_jsx_runtime.JSX.Element | undefined;
};

export { AirNodeIndexedUnion, AirPresence, AuthenticationConfig, FlatAirNode, ILiveIndexNode, IsEmptyArray, LiveIndexNode, NodeKey, TreeAirNode, TreeToNodeUnion, configureAuthentication, configureStorage, defineAirNode, defineAirNodeSchema };
