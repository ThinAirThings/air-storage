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
  configureAirStorage: () => configureAirStorage,
  defineAirNode: () => defineAirNode,
  defineRootAirNode: () => defineRootAirNode
});
module.exports = __toCommonJS(index_browser_exports);

// src/types.ts
var defineAirNode = (type, defaultInitialState, children) => ({
  type,
  state: defaultInitialState,
  children: children ?? []
});
var defineRootAirNode = (children) => defineAirNode("root", {}, children);

// src/configureAirStorage.tsx
var import_react = require("@liveblocks/react");

// src/types/MappedUnion.ts
var MappedUnion = class extends Map {
  constructor(unionMap) {
    super(unionMap);
  }
  get(type) {
    return super.get(type);
  }
};

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

// src/configureAirStorage.tsx
var import_client4 = require("@liveblocks/client");

// src/hooks/useAirNode/fns/createAirNodeFactory.ts
var import_uuid = require("uuid");
var import_client3 = require("@liveblocks/client");

// src/hooks/useAirNode/NodeKey.ts
var NodeKey = class {
  constructor(nodeId, type) {
    this.nodeId = nodeId;
    this.type = type;
  }
};

// src/hooks/useAirNode/fns/createAirNodeFactory.ts
var createAirNodeFactory = (useMutation, mappedAirNodeUnion) => (nodeKey) => useMutation(({ storage }, childType, callback) => {
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
  callback?.(newLiveIndexNode);
  storage.get("liveIndex").get(nodeKey.nodeId).get("childNodeSets").get(childType).set(nodeId, null);
  storage.get("liveIndex").set(nodeId, newLiveIndexNode);
  return new NodeKey(nodeId, childType);
}, []);

// src/hooks/useAirNode/fns/deleteAirNodeFactory.ts
var deleteAirNodeFactory = (useMutation) => (nodeKey) => useMutation(({ storage }, callback) => {
  callback?.(storage.get("liveIndex").get(nodeKey.nodeId));
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
  return new NodeKey(sibblingNodeId, nodeKey.type);
}, []);

// src/hooks/useAirNode/fns/useSelectAirNodeFactory.ts
var import_lodash = __toESM(require("lodash.isequal"), 1);
var useSelectAirNodeFactory = (useStorage) => (nodeKey) => (selector) => useStorage(({ liveIndex }) => {
  return selector(liveIndex.get(nodeKey.nodeId));
}, (a, b) => (0, import_lodash.default)(a, b));

// src/hooks/useAirNode/fns/updateAirNodeFactory.ts
var updateAirNodeFactory = (useMutation) => (nodeKey) => useMutation(({ storage }, callback) => {
  callback(storage.get("liveIndex").get(nodeKey.nodeId).get("state"));
}, []);

// src/hooks/useAirNode/fns/useChildrenAirNodeFactory.ts
var import_lodash2 = __toESM(require("lodash.isequal"), 1);
var useChildrenAirNodeFactory = (useStorage) => (nodeKey) => (childType) => useStorage(
  ({ liveIndex }) => new Set(
    [...liveIndex.get(nodeKey.nodeId).childNodeSets.get(childType).keys()].map((nodeId) => new NodeKey(childType, nodeId))
  ),
  (a, b) => (0, import_lodash2.default)(a, b)
);

// src/hooks/useAirNode/useAirNodeFactory.ts
var useAirNodeFactory = (useMutation, useStorage, mappedAirNodeUnion) => (nodeKey, fnType) => {
  return fnType === "create" ? createAirNodeFactory(useMutation, mappedAirNodeUnion)(nodeKey) : fnType === "useSelect" ? useSelectAirNodeFactory(useStorage)(nodeKey) : fnType === "useChildren" ? useChildrenAirNodeFactory(useStorage)(nodeKey) : fnType === "update" ? updateAirNodeFactory(useMutation)(nodeKey) : fnType === "delete" ? deleteAirNodeFactory(useMutation)(nodeKey) : (() => {
    throw new Error("Invalid fnType");
  })();
};

// src/configureAirStorage.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var configureAirStorage = (createClientProps, tree) => {
  const mappedAirNodeUnion = treeToMappedUnion(tree);
  const { suspense: liveblocks } = (0, import_react.createRoomContext)((0, import_client4.createClient)(createClientProps));
  const AirNodeProvider = ({
    storageId,
    children
  }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      liveblocks.RoomProvider,
      {
        id: storageId,
        initialPresence: {},
        initialStorage: new LiveIndexStorageModel(tree),
        children
      }
    );
  };
  const useAirNode = useAirNodeFactory(
    liveblocks.useMutation,
    liveblocks.useStorage,
    mappedAirNodeUnion
  );
  const useRootAirNode = (fnType) => useAirNode(
    new NodeKey("root", "root"),
    fnType
  );
  return {
    AirNodeProvider,
    useAirNode,
    useRootAirNode,
    mappedAirNodeUnion
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
  configureAirStorage,
  defineAirNode,
  defineRootAirNode
});
