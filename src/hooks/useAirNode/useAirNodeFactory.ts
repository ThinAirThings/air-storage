import { FlatAirNode, NodeKey } from "../../types.js";
import { AirNodeCreate, createAirNodeFactory } from "./fns/createAirNodeFactory.js";
import { AirNodeDelete, deleteAirNodeFactory } from "./fns/deleteAirNodeFactory.js";
import { AirNodeUseSelect, useSelectAirNodeFactory } from "./fns/useSelectAirNodeFactory.js";
import { AirNodeUpdate, updateAirNodeFactory } from "./fns/updateAirNodeFactory.js";
import { AirNodeUseChildren, useChildrenAirNodeFactory } from "./fns/useChildrenAirNodeFactory.js";
import { LiveblocksHooks } from "../../LiveObjects/LiveIndexStorageModel.js";
import { MappedUnion } from "../../types/MappedUnion.js";

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
        ? createAirNodeFactory(useMutation, mappedAirNodeUnion)(nodeKey) as any
        : fnType === "useSelect"
        ? useSelectAirNodeFactory(useStorage)(nodeKey)
        : fnType === "useChildren"
        ? useChildrenAirNodeFactory(useStorage)(nodeKey)
        : fnType === "update"
        ? updateAirNodeFactory(useMutation)(nodeKey)
        : fnType === "delete"
        ? deleteAirNodeFactory(useMutation)(nodeKey)
        : (() => {throw new Error('Invalid fnType')})()
}
