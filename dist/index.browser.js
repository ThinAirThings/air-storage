// src/structures/createNodeKeyFactory.ts
var createNodeKeyFactory = () => ({ nodeId, type }) => ({
  nodeId,
  type
});

// src/configureStorage.tsx
import { createRoomContext } from "@liveblocks/react";

// src/types/MappedUnion.ts
var MappedUnion = class extends Map {
  constructor(unionMap) {
    super(unionMap);
  }
  get(type) {
    return super.get(type);
  }
};

// src/configureStorage.tsx
import { createClient } from "@liveblocks/client";

// src/components/AirStorageProvider/AirStorageProviderFactory.tsx
import { Suspense } from "react";

// src/LiveObjects/LiveIndexStorageModel.ts
import { LiveMap } from "@liveblocks/client";
var LiveIndexStorageModel = class {
  constructor() {
    this.liveIndex = new LiveMap();
  }
};

// src/components/AirStorageProvider/AirStorageProviderFactory.tsx
import { jsx } from "react/jsx-runtime";
var AirStorageProviderFactory = (LiveblocksRoomProvider, initialLiveblocksPresence) => ({
  storageId,
  children
}) => {
  return /* @__PURE__ */ jsx(
    LiveblocksRoomProvider,
    {
      id: storageId,
      initialPresence: {
        ...initialLiveblocksPresence,
        nodeKeySelection: [],
        focusedNodeKey: null
      },
      initialStorage: new LiveIndexStorageModel(),
      children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading..." }), children })
    }
  );
};

// src/hooks-storage/useCreateNodeFactory.ts
import { LiveMap as LiveMap3, LiveObject as LiveObject3 } from "@liveblocks/client";

// src/LiveObjects/LiveIndexNode.ts
import { LiveObject as LiveObject2 } from "@liveblocks/client";
var LiveIndexNode = class extends LiveObject2 {
  constructor(data) {
    super(data);
  }
};

// src/hooks-storage/useCreateNodeFactory.ts
import { v4 as uuidv4 } from "uuid";
var useCreateNodeFactory = (useMutation, useSelfFocusedNodeKeyUpdate, createNodeKey, mappedAirNodeUnion) => () => {
  const updateFocusedNodeKey = useSelfFocusedNodeKeyUpdate();
  return useMutation(({ storage }, parentNodeKey, childType, callback) => {
    const nodeId = uuidv4();
    const newLiveIndexNode = new LiveIndexNode({
      nodeId,
      type: childType,
      parentNodeId: parentNodeKey?.nodeId ?? null,
      parentType: parentNodeKey?.type ?? null,
      state: new LiveObject3(mappedAirNodeUnion.get(childType).state),
      childNodeKeyMap: new LiveMap3()
    });
    callback?.(newLiveIndexNode);
    storage.get("liveIndex").get(parentNodeKey?.nodeId ?? "")?.get("childNodeKeyMap").set(nodeId, createNodeKey(newLiveIndexNode.toImmutable()));
    storage.get("liveIndex").set(nodeId, newLiveIndexNode);
    const newNodeKey = createNodeKey(newLiveIndexNode.toImmutable());
    updateFocusedNodeKey(newNodeKey);
    return newNodeKey;
  }, []);
};

// src/hooks-storage/useDeleteNodeFactory.ts
var useDeleteNodeFactory = (useMutation, useRemoveFromNodeKeySelection) => () => {
  const removeFromNodeKeySelection = useRemoveFromNodeKeySelection();
  return useMutation(({ storage }, nodeKey, callback) => {
    callback?.(
      storage.get("liveIndex").get(nodeKey.nodeId)
    );
    const liveIndex = storage.get("liveIndex");
    const thisNode = liveIndex.get(nodeKey.nodeId);
    const parentNode = liveIndex.get(thisNode.get("parentNodeId"));
    const deleteChildren = (node) => {
      liveIndex.delete(node.get("nodeId"));
      node.get("childNodeKeyMap").forEach(({ nodeId }) => {
        deleteChildren(liveIndex.get(nodeId));
      });
    };
    deleteChildren(thisNode);
    parentNode.get("childNodeKeyMap").delete(nodeKey.nodeId);
    removeFromNodeKeySelection(nodeKey);
  }, []);
};

// src/hooks-storage/useSelectNodeStateFactory.ts
import isEqual from "lodash.isequal";
var useSelectNodeStateFactory = (useStorage) => (nodeKey, selector) => useStorage(({ liveIndex }) => selector(
  liveIndex.get(nodeKey.nodeId).state
), (a, b) => isEqual(a, b));

// src/hooks-storage/useUpdateNodeStateFactory.ts
var useUpdateNodeStateFactory = (useMutation) => () => useMutation(({ storage }, nodeKey, callback) => {
  callback(storage.get("liveIndex").get(nodeKey.nodeId).get("state"));
}, []);

// src/hooks-storage/useNodeSetFactory.ts
var useNodeSetFactory = (useStorage) => (morphism) => useStorage(({ liveIndex }) => {
  return morphism(liveIndex);
});

// src/hooks-presence/useSelfNodeKeySelectionUpdateFactory.ts
var useSelfNodeKeySelectionUpdateFactory = (useUpdateMyPresence, useSelfNodeKeySelection) => () => {
  const updateMyPresence = useUpdateMyPresence();
  const nodeKeySelection = useSelfNodeKeySelection();
  return (updater) => {
    const newSelectedNodeKeySet = updater([...new Set(nodeKeySelection)]);
    updateMyPresence({
      nodeKeySelection: [...newSelectedNodeKeySet]
    });
  };
};

// src/hooks-presence/useSelfNodeKeySelectionFactory.ts
var useSelfNodeKeySelectionFactory = (useSelf) => () => useSelf(
  ({ presence }) => presence.nodeKeySelection
);

// src/hooks-presence/useSelfNodeKeySelectionRemoveFactory.ts
var useSelfNodeKeySelectionRemoveFactory = (useUpdateMyPresence, useSelfNodeKeySelection) => () => {
  const updateMyPresence = useUpdateMyPresence();
  const nodeKeySelection = useSelfNodeKeySelection();
  return (nodeKey) => {
    if (nodeKeySelection.some(({ nodeId }) => nodeId === nodeKey.nodeId)) {
      updateMyPresence({
        nodeKeySelection: nodeKeySelection.filter(({ nodeId }) => nodeId !== nodeKey.nodeId)
      });
      return true;
    }
    return false;
  };
};

// src/hooks-presence/useSelfNodeKeySelectionAddFactory.ts
var useSelfNodeKeySelectionAddFactory = (useUpdateMyPresence, useSelfNodeKeySelection) => () => {
  const updateMyPresence = useUpdateMyPresence();
  const nodeKeySelection = useSelfNodeKeySelection();
  return (nodeKey) => {
    if (!nodeKeySelection.some(({ nodeId }) => nodeId === nodeKey.nodeId)) {
      updateMyPresence({
        nodeKeySelection: [...nodeKeySelection, nodeKey]
      });
      return true;
    }
    return false;
  };
};

// src/hooks-presence/useSelfFocusedNodeKeyFactory.ts
var useSelfFocusedNodeKeyFactory = (useSelf) => () => useSelf(
  ({ presence }) => presence.focusedNodeKey
);

// src/hooks-presence/useSelfFocusedNodeKeyUpdateFactory.ts
import isEqual2 from "lodash.isequal";
var useSelfFocusedNodeKeyUpdateFactory = (useUpdateMyPresence, useSelfFocusedNodeKey, useSelfNodeKeySelectionAdd, useSelfNodeKeySelectionRemove) => () => {
  const updateMyPresence = useUpdateMyPresence();
  const addToNodeKeySelection = useSelfNodeKeySelectionAdd();
  const removeFromNodeKeySelection = useSelfNodeKeySelectionRemove();
  const focusedNodeKey = useSelfFocusedNodeKey();
  return (nodeKey) => {
    if (!isEqual2(focusedNodeKey, nodeKey)) {
      updateMyPresence({
        focusedNodeKey: nodeKey
      });
      nodeKey ? addToNodeKeySelection(nodeKey) : focusedNodeKey ? removeFromNodeKeySelection(focusedNodeKey) : null;
      return true;
    }
    return false;
  };
};

// src/structures/defineStaticIndexFactory.ts
var defineStaticIndexFactory = () => (index) => new StaticIndex(index);
var StaticIndex = class extends Map {
  constructor(index) {
    super(Object.entries(index));
  }
  get(type) {
    return super.get(type);
  }
};

// src/configureStorage.tsx
var configureStorage = (createClientProps, airNodeSchema, liveblocksPresence) => {
  const mappedAirNodeUnion = treeToMappedUnion(airNodeSchema);
  const { suspense: {
    useStorage,
    useMutation,
    RoomProvider,
    useUpdateMyPresence,
    useSelf,
    useRoom,
    RoomContext
  } } = createRoomContext(createClient(createClientProps));
  const useSelfNodeKeySelection = useSelfNodeKeySelectionFactory(
    useSelf
  );
  const useSelfNodeKeySelectionUpdate = useSelfNodeKeySelectionUpdateFactory(
    useUpdateMyPresence,
    useSelfNodeKeySelection
  );
  const useSelfNodeKeySelectionAdd = useSelfNodeKeySelectionAddFactory(
    useUpdateMyPresence,
    useSelfNodeKeySelection
  );
  const useSelfNodeKeySelectionRemove = useSelfNodeKeySelectionRemoveFactory(
    useUpdateMyPresence,
    useSelfNodeKeySelection
  );
  const useSelfFocusedNodeKey = useSelfFocusedNodeKeyFactory(
    useSelf
  );
  const useSelfFocusedNodeKeyUpdate = useSelfFocusedNodeKeyUpdateFactory(
    useUpdateMyPresence,
    useSelfFocusedNodeKey,
    useSelfNodeKeySelectionAdd,
    useSelfNodeKeySelectionRemove
  );
  const createNodeKey = createNodeKeyFactory();
  return {
    // Liveblocks Hooks
    useUpdateMyPresence,
    useSelf,
    useRoom,
    useStorage,
    RoomContext,
    // Air Storage Hooks
    useNodeSet: useNodeSetFactory(useStorage),
    useCreateNode: useCreateNodeFactory(
      useMutation,
      useSelfFocusedNodeKeyUpdate,
      createNodeKey,
      mappedAirNodeUnion
    ),
    useSelectNodeState: useSelectNodeStateFactory(useStorage),
    useUpdateNodeState: useUpdateNodeStateFactory(useMutation),
    useDeleteNode: useDeleteNodeFactory(useMutation, useSelfNodeKeySelectionRemove),
    AirStorageProvider: AirStorageProviderFactory(
      RoomProvider,
      liveblocksPresence ?? {}
    ),
    // Air Presence NodeKeySelection Hooks
    useSelfNodeKeySelection,
    useSelfNodeKeySelectionUpdate,
    useSelfNodeKeySelectionAdd,
    useSelfNodeKeySelectionRemove,
    // Air Presence NodeKeyFocus Hooks
    useSelfFocusedNodeKey,
    useSelfFocusedNodeKeyUpdate,
    // Structure Builder Functions
    defineStaticIndex: defineStaticIndexFactory(),
    createNodeKey
  };
};
var treeToMappedUnion = (tree) => {
  const treeToUnionMap = (map, tree2) => {
    map.set(tree2.type, {
      type: tree2.type,
      state: tree2.state
    });
    tree2.children.forEach((child) => treeToUnionMap(map, child));
    return map;
  };
  return treeToUnionMap(new MappedUnion([]), tree);
};

// src/defineAirNode.ts
var defineAirNode = (type, defaultInitialState, children) => ({
  type,
  state: defaultInitialState,
  children: children ?? []
  // destructor?:
});
var defineAirNodeSchema = (children) => defineAirNode("root", {}, children);

// src/components/AirAuthenticationProvider/AirAuthenticationProvider.tsx
import { createContext, useCallback, useState } from "react";
import { Navigate } from "react-router-dom";

// src/components/AirAuthenticationProvider/hooks/useRefreshToken.ts
import { useEffect } from "react";
var useRefreshToken = (authenticationState, setAuthenticationState, config) => {
  useEffect(() => {
    if (authenticationState.status === "refresh") {
      (async () => {
        try {
          setAuthenticationState({ status: "pending" });
          const authResponse = await fetch(`https://${config.authenticationApiBaseUrl}/refresh`, {
            method: "GET",
            credentials: "include",
            mode: "cors"
          });
          if (!authResponse.ok)
            throw new Error("Refresh token failed");
          const { accessToken } = await authResponse.json();
          setAuthenticationState({
            status: "authenticated",
            accessToken
          });
        } catch (error) {
          setAuthenticationState({ status: "unauthenticated" });
        }
      })();
    }
  }, [authenticationState.status]);
};

// src/components/AirAuthenticationProvider/hooks/useGrantToken.ts
import { useEffect as useEffect2 } from "react";
import { useLocation } from "react-router-dom";
var useGrantToken = (setAuthenticationState, config) => {
  const location = useLocation();
  useEffect2(() => {
    if (location.pathname === "/authentication/token") {
      (async () => {
        try {
          const grantTokenResponse = await fetch(`https://${config.oauthEndpoint}/oauth2/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              "grant_type": "authorization_code",
              "client_id": `${config.clientId}`,
              "code": new URLSearchParams(window.location.search).get("code"),
              "redirect_uri": `${config.grantTokenRedirectBasename}/authentication/token`
            })
          });
          const { refresh_token } = await grantTokenResponse.json();
          await fetch(`https://${config.authenticationApiBaseUrl}/create-refresh-cookie`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
              refreshToken: refresh_token
            }),
            mode: "cors"
          });
          setAuthenticationState({ status: "refresh" });
        } catch (error) {
          console.error(error);
          setAuthenticationState({ status: "unauthenticated" });
        }
      })();
    }
  }, [location.pathname]);
};

// src/components/AirAuthenticationProvider/AirAuthenticationProvider.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var AuthenticationContext = createContext(null);
var AirAuthenticationProviderFactory = (config) => ({
  children
}) => {
  const [authenticationState, setAuthenticationState] = useState({
    status: "refresh"
  });
  useRefreshToken(authenticationState, setAuthenticationState, config);
  useGrantToken(setAuthenticationState, config);
  const protectedFetch = useCallback(async (input, init) => {
    if (authenticationState.status !== "authenticated") {
      throw new Error("Cannot call protected fetch while not authenticated");
    }
    const response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        "Authorization": `Bearer ${authenticationState.accessToken}`
      }
    });
    if (response.status === 401) {
      setAuthenticationState({
        status: "unauthenticated"
      });
    }
    return response;
  }, [authenticationState]);
  if (authenticationState.status === "pending") {
    return /* @__PURE__ */ jsx2(config.Loading, {});
  }
  if (authenticationState.status === "unauthenticated") {
    return /* @__PURE__ */ jsx2(Navigate, { replace: true, to: "/authenticate" });
  }
  if (authenticationState.status === "authenticated") {
    return /* @__PURE__ */ jsx2(AuthenticationContext.Provider, { value: {
      accessToken: authenticationState.accessToken,
      protectedFetch
    }, children });
  }
};

// src/configureAuthentication.tsx
var configureAuthentication = (config) => {
  return {
    AirAuthenticationProvider: AirAuthenticationProviderFactory(
      config
    )
  };
};
export {
  LiveIndexNode,
  configureAuthentication,
  configureStorage,
  defineAirNode,
  defineAirNodeSchema
};
