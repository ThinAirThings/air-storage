// src/types.ts
var defineAirNode = (type, defaultInitialState, children) => ({
  type,
  state: defaultInitialState,
  children: children ?? []
});
var defineRootAirNode = (children) => defineAirNode("root", {}, children);

// src/configureAirStorage.tsx
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

// src/LiveObjects/LiveIndexStorageModel.ts
import { LiveMap as LiveMap2, LiveObject as LiveObject2 } from "@liveblocks/client";

// src/LiveObjects/LiveIndexNode.ts
import { LiveObject } from "@liveblocks/client";
var LiveIndexNode = class extends LiveObject {
  constructor(data) {
    super(data);
  }
};

// src/LiveObjects/LiveIndexStorageModel.ts
var LiveIndexStorageModel = class {
  constructor(treeRoot) {
    this.liveIndex = new LiveMap2([[
      "root",
      new LiveIndexNode({
        nodeId: "root",
        type: "RootNode",
        parentNodeId: null,
        parentType: null,
        childNodeSets: new LiveMap2(treeRoot.children.map(
          (child) => [child.type, new LiveMap2()]
        )),
        state: new LiveObject2({})
      })
    ]]);
  }
};

// src/configureAirStorage.tsx
import { createClient } from "@liveblocks/client";

// src/hooks/useAirNode/fns/createAirNodeFactory.ts
import { v4 as uuidv4 } from "uuid";
import { LiveMap as LiveMap3, LiveObject as LiveObject3 } from "@liveblocks/client";

// src/hooks/useAirNode/NodeKey.ts
var NodeKey = class {
  constructor(nodeId, type) {
    this.nodeId = nodeId;
    this.type = type;
  }
};

// src/hooks/useAirNode/fns/createAirNodeFactory.ts
var createAirNodeFactory = (useMutation, mappedAirNodeUnion) => (nodeKey) => useMutation(({ storage }, childType, callback) => {
  const nodeId = uuidv4();
  const newLiveIndexNode = new LiveIndexNode({
    nodeId,
    type: childType,
    parentNodeId: nodeKey.nodeId,
    parentType: nodeKey.type,
    state: new LiveObject3(mappedAirNodeUnion.get(childType).state),
    childNodeSets: new LiveMap3(
      [...mappedAirNodeUnion.get(childType).childTypeSet].map((childType2) => [childType2, new LiveMap3()])
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
import isEqual from "lodash.isequal";
var useSelectAirNodeFactory = (useStorage) => (nodeKey) => (selector) => useStorage(({ liveIndex }) => {
  return selector(liveIndex.get(nodeKey.nodeId));
}, (a, b) => isEqual(a, b));

// src/hooks/useAirNode/fns/updateAirNodeFactory.ts
var updateAirNodeFactory = (useMutation) => (nodeKey) => useMutation(({ storage }, callback) => {
  callback(storage.get("liveIndex").get(nodeKey.nodeId).get("state"));
}, []);

// src/hooks/useAirNode/fns/useChildrenAirNodeFactory.ts
import isEqual2 from "lodash.isequal";
var useChildrenAirNodeFactory = (useStorage) => (nodeKey) => (childType) => useStorage(
  ({ liveIndex }) => new Set(
    [...liveIndex.get(nodeKey.nodeId).childNodeSets.get(childType).keys()].map((nodeId) => new NodeKey(childType, nodeId))
  ),
  (a, b) => isEqual2(a, b)
);

// src/hooks/useAirNode/useAirNodeFactory.ts
var useAirNodeFactory = (useMutation, useStorage, mappedAirNodeUnion) => (nodeKey, fnType) => {
  return fnType === "create" ? createAirNodeFactory(useMutation, mappedAirNodeUnion)(nodeKey) : fnType === "useSelect" ? useSelectAirNodeFactory(useStorage)(nodeKey) : fnType === "useChildren" ? useChildrenAirNodeFactory(useStorage)(nodeKey) : fnType === "update" ? updateAirNodeFactory(useMutation)(nodeKey) : fnType === "delete" ? deleteAirNodeFactory(useMutation)(nodeKey) : (() => {
    throw new Error("Invalid fnType");
  })();
};

// src/configureAirStorage.tsx
import { Suspense } from "react";
import { jsx } from "react/jsx-runtime";
var configureAirStorage = (createClientProps, tree) => {
  const mappedAirNodeUnion = treeToMappedUnion(tree);
  const { suspense: liveblocks } = createRoomContext(createClient(createClientProps));
  const AirNodeProvider = ({
    storageId,
    children
  }) => {
    console.log("Running provider");
    return /* @__PURE__ */ jsx(
      liveblocks.RoomProvider,
      {
        id: storageId,
        initialPresence: {},
        initialStorage: () => new LiveIndexStorageModel(tree),
        children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading..." }), children })
      }
    );
  };
  const useAirNode = useAirNodeFactory(
    liveblocks.useMutation,
    liveblocks.useStorage,
    mappedAirNodeUnion
  );
  const useRootAirNode = () => new NodeKey("root", "root");
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
export {
  configureAirStorage,
  defineAirNode,
  defineRootAirNode
};
