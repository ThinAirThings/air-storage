"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.browser.ts
var index_browser_exports = {};
__export(index_browser_exports, {
  LiveIndexNode: () => LiveIndexNode,
  configureAuthentication: () => configureAuthentication,
  configureStorage: () => configureStorage,
  defineAirNode: () => defineAirNode,
  defineAirNodeSchema: () => defineAirNodeSchema
});
module.exports = __toCommonJS(index_browser_exports);

// src/structures/createNodeKeyFactory.ts
var createNodeKeyFactory = () => ({ nodeId, type }) => ({
  nodeId,
  type
});

// src/configureStorage.tsx
var import_react2 = require("@liveblocks/react");

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
var import_client4 = require("@liveblocks/client");

// src/components/AirStorageProvider/AirStorageProviderFactory.tsx
var import_react = require("react");

// src/LiveObjects/LiveIndexStorageModel.ts
var import_client = require("@liveblocks/client");
var LiveIndexStorageModel = class {
  constructor() {
    this.liveIndex = new import_client.LiveMap();
  }
};

// src/components/AirStorageProvider/AirStorageProviderFactory.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var AirStorageProviderFactory = (LiveblocksRoomProvider, initialLiveblocksPresence) => ({
  storageId,
  children
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    LiveblocksRoomProvider,
    {
      id: storageId,
      initialPresence: {
        ...initialLiveblocksPresence,
        nodeKeySelection: [],
        focusedNodeKey: null
      },
      initialStorage: new LiveIndexStorageModel(),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Loading..." }), children })
    }
  );
};

// src/hooks-storage/useCreateNodeFactory.ts
var import_client3 = require("@liveblocks/client");

// src/LiveObjects/LiveIndexNode.ts
var import_client2 = require("@liveblocks/client");
var LiveIndexNode = class extends import_client2.LiveObject {
  constructor(data) {
    super(data);
  }
};

// src/hooks-storage/useCreateNodeFactory.ts
var import_uuid = require("uuid");
var useCreateNodeFactory = (useMutation, useSelfFocusedNodeKeyUpdate, createNodeKey, mappedAirNodeUnion) => () => {
  const updateFocusedNodeKey = useSelfFocusedNodeKeyUpdate();
  return useMutation(({ storage }, parentNodeKey, childType, callback) => {
    const nodeId = (0, import_uuid.v4)();
    const newLiveIndexNode = new LiveIndexNode({
      nodeId,
      type: childType,
      parentNodeId: parentNodeKey?.nodeId ?? null,
      parentType: parentNodeKey?.type ?? null,
      state: new import_client3.LiveObject(mappedAirNodeUnion.get(childType).state),
      childNodeKeyMap: new import_client3.LiveMap()
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
var import_lodash = __toESM(require("lodash.isequal"), 1);
var useSelectNodeStateFactory = (useStorage) => (nodeKey, selector) => useStorage(({ liveIndex }) => selector(
  liveIndex.get(nodeKey.nodeId).state
), (a, b) => (0, import_lodash.default)(a, b));

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
var import_lodash2 = __toESM(require("lodash.isequal"), 1);
var useSelfFocusedNodeKeyUpdateFactory = (useUpdateMyPresence, useSelfFocusedNodeKey, useSelfNodeKeySelectionAdd, useSelfNodeKeySelectionRemove) => () => {
  const updateMyPresence = useUpdateMyPresence();
  const addToNodeKeySelection = useSelfNodeKeySelectionAdd();
  const removeFromNodeKeySelection = useSelfNodeKeySelectionRemove();
  const focusedNodeKey = useSelfFocusedNodeKey();
  return (nodeKey) => {
    if (!(0, import_lodash2.default)(focusedNodeKey, nodeKey)) {
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
  } } = (0, import_react2.createRoomContext)((0, import_client4.createClient)(createClientProps));
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
var import_react5 = require("react");
var import_react_router_dom2 = require("react-router-dom");

// src/components/AirAuthenticationProvider/hooks/useRefreshToken.ts
var import_react3 = require("react");
var useRefreshToken = (authenticationApiOrigin, authenticationState, setAuthenticationState) => {
  (0, import_react3.useEffect)(() => {
    if (authenticationState.status === "refresh") {
      (async () => {
        try {
          setAuthenticationState({ status: "pending" });
          const authResponse = await fetch(`https://${authenticationApiOrigin}/refresh`, {
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
var import_react4 = require("react");
var import_react_router_dom = require("react-router-dom");
var useGrantToken = (authenticationApiOrigin, setAuthenticationState, cognitoConfig) => {
  const location = (0, import_react_router_dom.useLocation)();
  (0, import_react4.useEffect)(() => {
    if (location.pathname === "/authentication/token") {
      (async () => {
        const grantTokenResponse = await fetch(`https://${cognitoConfig.oauthEndpoint}/oauth2/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            "grant_type": "authorization_code",
            "client_id": `${cognitoConfig.clientId}`,
            "code": new URLSearchParams(window.location.search).get("code"),
            "redirect_uri": `${cognitoConfig.grantTokenRedirectBasename}/authentication/token`
          })
        });
        const { refresh_token } = await grantTokenResponse.json();
        await fetch(`https://${authenticationApiOrigin}/create-refresh-cookie`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            refreshToken: refresh_token
          }),
          mode: "cors"
        });
        setAuthenticationState({ status: "refresh" });
      })();
    }
  }, [location.pathname]);
};

// src/components/AirAuthenticationProvider/AirAuthenticationProvider.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var AuthenticationContext = (0, import_react5.createContext)(null);
var AirAuthenticationProviderFactory = (config) => ({
  children
}) => {
  const [authenticationState, setAuthenticationState] = (0, import_react5.useState)({
    status: "refresh"
  });
  useRefreshToken(config.authenticationApiBaseUrl, authenticationState, setAuthenticationState);
  useGrantToken(config.authenticationApiBaseUrl, setAuthenticationState, config.cognitoConfig);
  const protectedFetch = (0, import_react5.useCallback)(async (input, init) => {
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
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(config.Loading, {});
  }
  if (authenticationState.status === "unauthenticated") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_router_dom2.Navigate, { replace: true, to: "/authenticate" });
  }
  if (authenticationState.status === "authenticated") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AuthenticationContext.Provider, { value: {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LiveIndexNode,
  configureAuthentication,
  configureStorage,
  defineAirNode,
  defineAirNodeSchema
});
