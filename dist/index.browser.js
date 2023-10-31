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

// src/configureAirStorage.tsx
import { createClient } from "@liveblocks/client";

// src/hooks/useAirNode/NodeKey.ts
var NodeKey = class {
  constructor(nodeId, type) {
    this.nodeId = nodeId;
    this.type = type;
  }
};

// src/components/AirNodeProviderFactory.tsx
import { Suspense } from "react";

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
        state: new LiveObject2({
          nodeName: "root"
        })
      })
    ]]);
  }
};

// src/components/AirNodeProviderFactory.tsx
import { jsx } from "react/jsx-runtime";
var AirNodeProviderFactory = (rootAirNode, LiveblocksRoomProvider) => ({
  storageId,
  children
}) => {
  return /* @__PURE__ */ jsx(
    LiveblocksRoomProvider,
    {
      id: storageId,
      initialPresence: {},
      initialStorage: new LiveIndexStorageModel(rootAirNode),
      children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading..." }), children })
    }
  );
};

// src/hooks/customHooks/useChildrenKeysFactory.ts
import isEqual from "lodash.isequal";
var useChildrenKeysFactory = (useStorage) => (nodeKey, childType) => useStorage(({ liveIndex }) => new Set(
  [...liveIndex.get(nodeKey.nodeId).childNodeSets.get(childType).keys()].map((nodeId) => new NodeKey(childType, nodeId))
), (a, b) => isEqual(a, b));

// src/hooks/customHooks/useCreateNodeFactory.ts
import { LiveMap as LiveMap3, LiveObject as LiveObject3 } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
var useCreateNodeFactory = (useMutation, mappedAirNodeUnion) => (nodeKey, childType, callback) => useMutation(({ storage }) => {
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

// src/hooks/customHooks/useDeleteNodeFactory.ts
var useDeleteNodeFactory = (useMutation) => (nodeKey, callback) => useMutation(({ storage }) => {
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

// src/hooks/customHooks/useSelectNodeFactory.ts
import isEqual2 from "lodash.isequal";
var useSelectNodeStateFactory = (useStorage) => (nodeKey, selector) => useStorage(({ liveIndex }) => selector(
  liveIndex.get(nodeKey.nodeId)
), (a, b) => isEqual2(a, b));

// src/hooks/customHooks/useNodeNameFactory.ts
var useNodeNameFactory = (useStorage) => (nodeKey) => useStorage(({ liveIndex }) => {
  return liveIndex.get(nodeKey.nodeId).state.nodeName;
});

// src/hooks/customHooks/useUpdateNodeStateFactory.ts
var useUpdateNodeStateFactory = (useMutation) => (nodeKey, callback) => useMutation(({ storage }) => {
  callback(storage.get("liveIndex").get(nodeKey.nodeId).get("state"));
}, [nodeKey, callback]);

// src/configureAirStorage.tsx
var configureAirStorage = (createClientProps, rootAirNode) => {
  const mappedAirNodeUnion = treeToMappedUnion(rootAirNode);
  const { suspense: {
    useStorage,
    useMutation,
    RoomProvider
  } } = createRoomContext(createClient(createClientProps));
  return {
    useCreateNode: useCreateNodeFactory(useMutation, mappedAirNodeUnion),
    useSelectNodeState: useSelectNodeStateFactory(useStorage),
    useUpdateNodeState: useUpdateNodeStateFactory(useMutation),
    useNodeName: useNodeNameFactory(useStorage),
    useDeleteNode: useDeleteNodeFactory(useMutation),
    useChildrenKeys: useChildrenKeysFactory(useStorage),
    AirNodeProvider: AirNodeProviderFactory(rootAirNode, RoomProvider),
    // Only use 'useStorage' here because Liveblocks will throw an error if useStorage isn't called before using mutations.
    useRootAirNode: () => useStorage(() => new NodeKey("root", "root")),
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
  configureAirStorage
};
