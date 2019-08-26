import abiDecoder = require("abi-decoder");
import * as mc from "chain3/lib/chain3/methods/mc";
import isArray = require("lodash/isArray");
import isFunction = require("lodash/isFunction");
import isObject = require("lodash/isObject");

export default class MoacABI {

    private _contract: any;
    private _abi: any[];

    constructor(contract: any) {

        /**
         * TODO: https://github.com/MOACChain/chain3/pull/14
         * if PR and released, should use `contract instanceof Contract` to check input value if valid.
         */
        if (isObject(contract) && (contract["_mc"] instanceof mc) && isArray(contract["abi"])) {
            this._contract = contract;
            this._abi = contract["abi"];
        } else {
            throw new Error("The input value isn't a contract instance");
        }
    }

    public encode(name: string, ...args) {
        const method: any = this._contract[name];
        if (!isFunction(method)) {
            throw new Error(`The contract doesn't contain "${name}" function`);
        }
        return method["getData"].apply(null, args);
    }

    public decode(data: any) {
        if (abiDecoder.getABIs().length === 0) {
            abiDecoder.addABI(this._abi);
        }
        const decodedData = abiDecoder.decodeMethod(data);
        return decodedData;
    }
}

export { MoacABI };
