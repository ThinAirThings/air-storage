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
  configureAirStorage: () => configureAirStorage,
  createNodeKey: () => createNodeKey,
  defineAirNode: () => defineAirNode,
  defineRootAirNode: () => defineRootAirNode,
  extendAirNodeDefinition: () => extendAirNodeDefinition,
  treeToStructureIndex: () => treeToStructureIndex
});
module.exports = __toCommonJS(index_browser_exports);

// src/configureAirStorage.tsx
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

// src/configureAirStorage.tsx
var import_client4 = require("@liveblocks/client");

// src/types/NodeKey.ts
var createNodeKey = (nodeId, type) => ({
  nodeId,
  type
});

// src/components/AirNodeProviderFactory.tsx
var import_react = require("react");

// src/LiveObjects/LiveIndexStorageModel.ts
var import_client2 = require("@liveblocks/client");

// src/LiveObjects/LiveIndexNode.ts
var import_client = require("@liveblocks/client");
var LiveIndexNode = class extends import_client.LiveObject {
  constructor(data) {
    super(data);
  }
};

// src/LiveObjects/LiveIndexStorageModel.ts
var LiveIndexStorageModel = class {
  constructor(treeRoot) {
    this.liveIndex = new import_client2.LiveMap([[
      "root",
      new LiveIndexNode({
        nodeId: "root",
        type: "RootNode",
        parentNodeId: null,
        parentType: null,
        childNodeSets: new import_client2.LiveMap(treeRoot.children.map(
          (child) => [child.type, new import_client2.LiveMap()]
        )),
        state: new import_client2.LiveObject({})
      })
    ]]);
  }
};

// src/components/AirNodeProviderFactory.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var AirNodeProviderFactory = (rootAirNode, LiveblocksRoomProvider, initialLiveblocksPresence) => ({
  storageId,
  children
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    LiveblocksRoomProvider,
    {
      id: storageId,
      initialPresence: initialLiveblocksPresence,
      initialStorage: new LiveIndexStorageModel(rootAirNode),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Loading..." }), children })
    }
  );
};

// src/hooks/useChildrenNodeKeysFactory.ts
var import_lodash = __toESM(require("lodash.isequal"), 1);
var useChildrenNodeKeysFactory = (useStorage) => (nodeKey, childType) => useStorage(({ liveIndex }) => new Set(
  [...liveIndex.get(nodeKey.nodeId).childNodeSets.get(childType).keys()].map((nodeId) => createNodeKey(nodeId, childType))
), (a, b) => (0, import_lodash.default)(a, b));

// src/hooks/useCreateNodeFactory.ts
var import_client3 = require("@liveblocks/client");
var import_uuid = require("uuid");
var useCreateNodeFactory = (useMutation, mappedAirNodeUnion, extensionIndex) => (nodeKey) => useMutation(({ storage }, childType, callback) => {
  const nodeId = (0, import_uuid.v4)();
  const newLiveIndexNode = new LiveIndexNode({
    nodeId,
    type: childType,
    parentNodeId: nodeKey.nodeId,
    parentType: nodeKey.type,
    state: new import_client3.LiveObject(mappedAirNodeUnion.get(childType).state),
    childNodeSets: new import_client3.LiveMap(
      [...mappedAirNodeUnion.get(childType).childTypeSet].map((childType2) => [childType2, new import_client3.LiveMap()])
    )
  });
  callback?.(newLiveIndexNode, extensionIndex[childType]);
  storage.get("liveIndex").get(nodeKey.nodeId).get("childNodeSets").get(childType).set(nodeId, null);
  storage.get("liveIndex").set(nodeId, newLiveIndexNode);
  return createNodeKey(nodeId, childType);
}, []);

// src/hooks/useDeleteNodeFactory.ts
var useDeleteNodeFactory = (useMutation, extensionIndex) => (nodeKey, callback) => useMutation(({ storage }) => {
  callback?.(
    storage.get("liveIndex").get(nodeKey.nodeId),
    extensionIndex[nodeKey.type]
  );
  const liveIndex = storage.get("liveIndex");
  const thisNode = liveIndex.get(nodeKey.nodeId);
  const parentNode = liveIndex.get(thisNode.get("parentNodeId"));
  const deleteChildren = (node) => {
    liveIndex.delete(node.get("nodeId"));
    node.get("childNodeSets").forEach((childNodeSet) => {
      childNodeSet.forEach((_, childNodeId) => {
        deleteChildren(liveIndex.get(childNodeId));
      });
    });
  };
  deleteChildren(thisNode);
  parentNode.get("childNodeSets").get(nodeKey.type).delete(nodeKey.nodeId);
  const sibblingNodeId = [...parentNode.get("childNodeSets").get(nodeKey.type).keys()][0];
  return createNodeKey(sibblingNodeId, nodeKey.type);
}, []);

// src/hooks/useSelectNodeFactory.ts
var import_lodash2 = __toESM(require("lodash.isequal"), 1);
var useSelectNodeStateFactory = (useStorage, extensionIndex) => (nodeKey, selector) => useStorage(({ liveIndex }) => selector(
  liveIndex.get(nodeKey.nodeId).state,
  extensionIndex[nodeKey.type]
), (a, b) => (0, import_lodash2.default)(a, b));

// src/hooks/useUpdateNodeStateFactory.ts
var useUpdateNodeStateFactory = (useMutation, extensionIndex) => (nodeKey) => useMutation(({ storage }, callback) => {
  callback(storage.get("liveIndex").get(nodeKey.nodeId).get("state"), extensionIndex[nodeKey.type]);
}, [nodeKey]);

// src/defineAirNode.ts
var defineAirNode = (type, struct, defaultInitialState, children) => ({
  type,
  struct,
  state: defaultInitialState,
  children: children ?? []
  // destructor?:
});
var defineRootAirNode = (children) => defineAirNode("root", {}, { nodeName: "root" }, children);

// src/extendAirNodeDefinition.ts
var extendAirNodeDefinition = () => (type, ext, defaultInitialState, children) => defineAirNode(type, ext, defaultInitialState, children);
var treeToStructureIndex = (tree) => {
  const index = {};
  const visit = (node) => {
    if (Object.keys(node.struct).length > 0) {
      index[node.type] = node.struct;
    }
    node.children.forEach(visit);
  };
  visit(tree);
  return index;
};

// src/hooks/useNodeSetFactory.ts
var import_lodash3 = __toESM(require("lodash.isequal"), 1);
var useNodeSetFactory = (useStorage) => (predicate) => useStorage(({ liveIndex }) => {
  return new Set(
    [...liveIndex.values()].filter(predicate)
  );
}, (a, b) => (0, import_lodash3.default)(a, b));

// src/configureAirStorage.tsx
var configureAirStorage = (createClientProps, rootAirNode, liveblocksPresence) => {
  const mappedAirNodeUnion = treeToMappedUnion(rootAirNode);
  const StructureIndex = treeToStructureIndex(rootAirNode);
  const { suspense: {
    useStorage,
    useMutation,
    RoomProvider,
    useUpdateMyPresence,
    useSelf
  } } = (0, import_react2.createRoomContext)((0, import_client4.createClient)(createClientProps));
  return {
    // Liveblocks Hooks
    useUpdateMyPresence,
    useSelf,
    // Air Hooks
    useNodeSet: useNodeSetFactory(useStorage),
    useCreateNode: useCreateNodeFactory(useMutation, mappedAirNodeUnion, StructureIndex),
    useSelectNodeState: useSelectNodeStateFactory(useStorage, StructureIndex),
    useUpdateNodeState: useUpdateNodeStateFactory(useMutation, StructureIndex),
    useDeleteNode: useDeleteNodeFactory(useMutation, StructureIndex),
    useChildrenNodeKeys: useChildrenNodeKeysFactory(useStorage),
    AirNodeProvider: AirNodeProviderFactory(rootAirNode, RoomProvider, liveblocksPresence ?? {}),
    // Only use 'useStorage' here because Liveblocks will throw an error if useStorage isn't called before using mutations.
    useRootAirNode: () => useStorage(() => createNodeKey("root", "root")),
    StructureIndex
  };
};
var treeToMappedUnion = (tree) => {
  const treeToUnionMap = (map, tree2) => {
    map.set(tree2.type, {
      type: tree2.type,
      state: tree2.state,
      childTypeSet: new Set(tree2.children.map((child) => child.type))
    });
    tree2.children.forEach((child) => treeToUnionMap(map, child));
    return map;
  };
  return treeToUnionMap(new MappedUnion([]), tree);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LiveIndexNode,
  configureAirStorage,
  createNodeKey,
  defineAirNode,
  defineRootAirNode,
  extendAirNodeDefinition,
  treeToStructureIndex
});
