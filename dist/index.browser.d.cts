import { LsonObject, LiveObject, LiveMap, createClient } from '@liveblocks/client';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _liveblocks_react from '@liveblocks/react';
import * as _liveblocks_core from '@liveblocks/core';
import { ReactNode } from 'react';

type TreeAirNode<T extends string = string, S extends LsonObject = LsonObject, C extends TreeAirNode[] | [] = TreeAirNode<string, LsonObject, any>[] | []> = {
    type: T;
    state: S;
    children: C;
};
declare const defineAirNode: <T extends string = string, S extends LsonObject = LsonObject, C extends [] | TreeAirNode<string, LsonObject, TreeAirNode<string, LsonObject, any>[] | []>[] = []>(type: T, defaultInitialState: S, children: C) => TreeAirNode<T, S, C>;
declare const defineRootAirNode: <C extends TreeAirNode<string, LsonObject, TreeAirNode<string, LsonObject, any>[] | []>[]>(children: C) => TreeAirNode<"root", {}, C>;
type ExtractChildTypeUnion<N extends FlatAirNode> = N['childTypeSet'] extends Set<infer CT extends string> ? CT : never;
type FlatAirNode<T extends string = string, S extends LsonObject = LsonObject, CK extends string = string> = {
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

declare class MappedUnion<U extends FlatAirNode = FlatAirNode> extends Map<U['type'], U> {
    constructor(unionMap: Array<[U['type'], U]>);
    get<T extends U['type']>(type: T): (U & {
        type: T;
    });
}

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

declare class NodeKey<T extends string = string> {
    nodeId: string;
    type: T;
    constructor(nodeId: string, type: T);
}

type AirNodeCreate<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type']> = <CT extends ExtractChildTypeUnion<(U & {
    type: T;
})>>(childType: CT, callback?: (liveIndexNode: LiveIndexNode<(U & {
    type: CT;
})['state']>) => void) => NodeKey<CT>;

type AirNodeDelete<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type'], S extends (U & {
    type: T;
})['state'] = (U & {
    type: T;
})['state']> = (callback: (liveIndexNode: LiveIndexNode<S>) => void) => NodeKey<T>;

type AirNodeUseSelect<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type'], S extends (U & {
    type: T;
})['state'] = (U & {
    type: T;
})['state']> = <R>(selector: (immutableIndexNode: ReturnType<LiveIndexNode<S>['toImmutable']>) => R) => R;

type AirNodeUpdate<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type'], S extends (U & {
    type: T;
})['state'] = (U & {
    type: T;
})['state']> = (callback: (liveIndexNode: LiveObject<S>) => void) => void;

type AirNodeUseChildren<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type']> = <CT extends ExtractChildTypeUnion<(U & {
    type: T;
})>>(childType: CT) => Set<NodeKey<CT>>;

type CrudUnion<U extends FlatAirNode = FlatAirNode, T extends U['type'] = U['type'], S extends (U & {
    type: T;
})['state'] = (U & {
    type: T;
})['state']> = {
    fnType: 'create';
    fnSignature: AirNodeCreate<U, T>;
} | {
    fnType: 'useSelect';
    fnSignature: AirNodeUseSelect<U, T, S>;
} | {
    fnType: 'useChildren';
    fnSignature: AirNodeUseChildren<U, T>;
} | {
    fnType: 'update';
    fnSignature: AirNodeUpdate<U, T, S>;
} | {
    fnType: 'delete';
    fnSignature: AirNodeDelete<U, T, S>;
};

declare const configureAirStorage: <U extends FlatAirNode>(createClientProps: Parameters<typeof createClient>[0], tree: TreeAirNode) => {
    useMutation: <F extends (context: _liveblocks_react.MutationContext<{}, ILiveIndexStorageModel, _liveblocks_core.BaseUserMeta>, ...args: any[]) => any>(callback: F, deps: readonly unknown[]) => F extends (first: any, ...rest: infer A) => infer R ? (...args: A) => R : never;
    useStatus: () => _liveblocks_core.Status;
    AirNodeProvider: ({ storageId, children }: {
        storageId: string;
        children: ReactNode;
    }) => react_jsx_runtime.JSX.Element;
    useAirNode: <T extends U["type"], FnT extends "delete" | "update" | "create" | "useSelect" | "useChildren">(nodeKey: NodeKey$1<T>, fnType: FnT) => (CrudUnion<U, T, (U & {
        type: T;
    })["state"]> & {
        fnType: FnT;
    })["fnSignature"];
    useRootAirNode: () => NodeKey<"root">;
    mappedAirNodeUnion: MappedUnion<FlatAirNode>;
};

export { AirNodeIndexedUnion, ExtractChildTypeUnion, FlatAirNode, NodeKey$1 as NodeKey, TreeAirNode, TreeToUnion, configureAirStorage, defineAirNode, defineRootAirNode };
