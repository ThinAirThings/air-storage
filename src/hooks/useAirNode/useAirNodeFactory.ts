import { FlatAirNode, NodeKey } from "../../types.js";
import { AirNodeCreate, airNodeCreateFactory } from "./fns/airNodeCreateFactory.js";
import { AirNodeDelete, airNodeDeleteFactory } from "./fns/airNodeDeleteFactory.js";
import { AirNodeUseSelect, useSelectAirNodeFactory } from "./fns/useSelectAirNodeFactory.js";
import { AirNodeUpdate, airNodeUpdateFactory } from "./fns/airNodeUpdateFactory.js";
import { AirNodeUseChildren, useChildrenAirNodeFactory } from "./fns/useChildrenAirNodeFactory.js";
import { LiveblocksHooks } from "../../LiveObjects/LiveIndexStorageModel.js";
import { MappedUnion } from "../../types/MappedUnion.js";
import { AirNodeUseNodeName, useAirNodeNameFactory } from "./fns/useNodeNameFactory.js";

export type CrudUnion<
    U extends FlatAirNode=FlatAirNode,
    T extends U['type']=U['type'],
    S extends (U&{type: T})['state']=(U&{type: T})['state']
> = 
    | {
        fnType: 'create',
        fnSignature: AirNodeCreate<U, T> 
    }
    | {
        fnType: 'useSelect',
        fnSignature: AirNodeUseSelect<U, T, S>
    }
    | {
        fnType: 'useNodeName',
        fnSignature: AirNodeUseNodeName
    }
    | {
        fnType: 'useChildren',
        fnSignature: AirNodeUseChildren<U, T>
    }
    | {
        fnType: 'update',
        fnSignature: AirNodeUpdate<U, T, S>
    }
    | {
        fnType: 'delete',
        fnSignature: AirNodeDelete<U, T, S>
    }


export const useAirNodeFactory = <
    U extends FlatAirNode
>(
    useMutation: LiveblocksHooks['useMutation'],
    useStorage: LiveblocksHooks['useStorage'],
    mappedAirNodeUnion: MappedUnion
) => <
    T extends U['type'],
    FnT extends CrudUnion<U, T>['fnType'],
>(
    nodeKey: NodeKey<T>,
    fnType: FnT,
): (CrudUnion<U, T>&{fnType: FnT})['fnSignature'] => {
    return fnType === "create" 
        // Not sure why TS can't handle this. Think it has something to do with returning a generic function.
        ? airNodeCreateFactory(useMutation, mappedAirNodeUnion)(nodeKey) as any
        : fnType === "useSelect"
        ? useSelectAirNodeFactory(useStorage)(nodeKey)
        : fnType === "useNodeName"
        ? useAirNodeNameFactory(useStorage)(nodeKey)
        : fnType === "useChildren"
        ? useChildrenAirNodeFactory(useStorage)(nodeKey)
        : fnType === "update"
        ? airNodeUpdateFactory(useMutation)(nodeKey)
        : fnType === "delete"
        ? airNodeDeleteFactory(useMutation)(nodeKey)
        : (() => {throw new Error('Invalid fnType')})()
}
