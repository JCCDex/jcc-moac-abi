import abiDecoder = require("abi-decoder");
import * as mc from "chain3/lib/chain3/methods/mc";
import isArray = require("lodash/isArray");
import isFunction = require("lodash/isFunction");
import isObject = require("lodash/isObject");

/**
 * decoder and encoder for moac
 *
 * @export
 * @class MoacABI
 */
export default class MoacABI {

    /**
     * moac contract instance
     *
     * @private
     * @type {*}
     * @memberof MoacABI
     */
    private _contract: any;

    /**
     * moac abi
     *
     * @private
     * @type {any[]}
     * @memberof MoacABI
     */
    private _abi: any[];

    /**
     * Creates an instance of MoacABI.
     * @todo if [pr](https://github.com/MOACChain/chain3/pull/14) and released, should use `contract instanceof Contract` to check input value if valid.
     * @param {*} contract
     * @memberof MoacABI
     */
    constructor(contract: any) {

        if (isObject(contract) && (contract["_mc"] instanceof mc) && isArray(contract["abi"])) {
            this._contract = contract;
            this._abi = contract["abi"];
        } else {
            throw new Error("The input value isn't a contract instance");
        }
    }

    /**
     * encode the input value by function name
     *
     * @param {string} name defined function name in the abi
     * @param {*} args parameters according to the defined inputs
     * @returns {string}
     * @memberof MoacABI
     */
    public encode(name: string, ...args): string {
        const method: any = this._contract[name];
        if (!isFunction(method)) {
            throw new Error(`The contract doesn't contain "${name}" function`);
        }
        const filterABIs = this._abi.filter((item) => item.name === name);
        if (filterABIs.length === 1) {
            return method["getData"].apply(null, args);
        }
        const abi = filterABIs.find((item) => item.inputs.length === args.length);
        if (!abi) {
            throw new Error("Invalid number of arguments to Solidity function");
        }

        /**
         * detail: https://github.com/MOACChain/chain3/blob/master/lib/chain3/function.js#L282
         *
         */
        const typename = abi.inputs.map((input) => input.type).join(",");
        return method[typename].getData.apply(null, args);
    }

    /**
     * decode the input value
     *
     * @param {string} data
     * @returns {*}
     * @memberof MoacABI
     */
    public decode(data: string): any {
        if (abiDecoder.getABIs().length === 0) {
            abiDecoder.addABI(this._abi);
        }
        const decodedData = abiDecoder.decodeMethod(data);
        return decodedData;
    }

    public destroy() {
        abiDecoder.getABIs().length = 0;
        abiDecoder.getMethodIDs().length = 0;
    }
}

export { MoacABI };
