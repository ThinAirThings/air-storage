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

// src/types/NodeKey.ts
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
        state: new LiveObject2({})
      })
    ]]);
  }
};

// src/components/AirNodeProviderFactory.tsx
import { jsx } from "react/jsx-runtime";
var AirNodeProviderFactory = (rootAirNode, LiveblocksRoomProvider, initialLiveblocksPresence) => ({
  storageId,
  children
}) => {
  return /* @__PURE__ */ jsx(
    LiveblocksRoomProvider,
    {
      id: storageId,
      initialPresence: initialLiveblocksPresence,
      initialStorage: new LiveIndexStorageModel(rootAirNode),
      children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading..." }), children })
    }
  );
};

// src/hooks/useChildrenNodeKeysFactory.ts
import isEqual from "lodash.isequal";
var useChildrenNodeKeysFactory = (useStorage) => (nodeKey, childType) => useStorage(({ liveIndex }) => new Set(
  [...liveIndex.get(nodeKey.nodeId).childNodeSets.get(childType).keys()].map((nodeId) => new NodeKey(nodeId, childType))
), (a, b) => isEqual(a, b));

// src/hooks/useCreateNodeFactory.ts
import { LiveMap as LiveMap3, LiveObject as LiveObject3 } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
var useCreateNodeFactory = (useMutation, mappedAirNodeUnion, extensionIndex) => (nodeKey) => useMutation(({ storage }, childType, callback) => {
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
  callback?.(newLiveIndexNode, extensionIndex[childType]);
  storage.get("liveIndex").get(nodeKey.nodeId).get("childNodeSets").get(childType).set(nodeId, null);
  storage.get("liveIndex").set(nodeId, newLiveIndexNode);
  return new NodeKey(nodeId, childType);
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
  return new NodeKey(sibblingNodeId, nodeKey.type);
}, []);

// src/hooks/useSelectNodeFactory.ts
import isEqual2 from "lodash.isequal";
var useSelectNodeStateFactory = (useStorage, extensionIndex) => (nodeKey, selector) => useStorage(({ liveIndex }) => selector(
  liveIndex.get(nodeKey.nodeId).state,
  extensionIndex[nodeKey.type]
), (a, b) => isEqual2(a, b));

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
    if (node.struct.keys().length > 0) {
      index[node.type] = node.struct;
    }
    node.children.forEach(visit);
  };
  visit(tree);
  return index;
};

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
  } } = createRoomContext(createClient(createClientProps));
  return {
    // Liveblocks Hooks
    useUpdateMyPresence,
    useSelf,
    // Air Hooks
    useCreateNode: useCreateNodeFactory(useMutation, mappedAirNodeUnion, StructureIndex),
    useSelectNodeState: useSelectNodeStateFactory(useStorage, StructureIndex),
    useUpdateNodeState: useUpdateNodeStateFactory(useMutation, StructureIndex),
    useDeleteNode: useDeleteNodeFactory(useMutation, StructureIndex),
    useChildrenNodeKeys: useChildrenNodeKeysFactory(useStorage),
    AirNodeProvider: AirNodeProviderFactory(rootAirNode, RoomProvider, liveblocksPresence ?? {}),
    // Only use 'useStorage' here because Liveblocks will throw an error if useStorage isn't called before using mutations.
    useRootAirNode: () => useStorage(() => new NodeKey("root", "root")),
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
export {
  LiveIndexNode,
  configureAirStorage,
  defineAirNode,
  defineRootAirNode,
  extendAirNodeDefinition,
  treeToStructureIndex
};
