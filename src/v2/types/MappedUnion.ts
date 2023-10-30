import { FlatAirNode } from "../types.js";



export class MappedUnion<U extends FlatAirNode=FlatAirNode> extends Map<U['type'], U> {
    constructor(unionMap: Array<[U['type'], U]>){
        super(unionMap)
    }
    get<T extends U['type']>(type: T): (U&{type: T}){
        return super.get(type) as (U&{type: T})
    }
}