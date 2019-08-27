import abiDecoder = require("abi-decoder");
import isArray = require("lodash/isArray");
import isFunction = require("lodash/isFunction");
import isObject = require("lodash/isObject");
import abiCoder = require("web3-eth-abi");
import { BN } from "web3-utils";
import { IDecodedLogs, ILogs } from "./model";

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
     * @param {*} contract moac contract instance
     * @memberof MoacABI
     */
    constructor(contract: any) {

        if (isObject(contract) && isArray(contract["abi"])) {
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
        let decodedData: string;
        if (filterABIs.length === 1) {
            decodedData = method["getData"].apply(null, args);
        } else {
            const abi = filterABIs.find((item) => item.inputs.length === args.length);
            if (!abi) {
                throw new Error("Invalid number of arguments to Solidity function");
            }

            /**
             * detail: https://github.com/MOACChain/chain3/blob/master/lib/chain3/function.js#L282
             *
             */
            const typename = abi.inputs.map((input) => input.type).join(",");
            decodedData = method[typename].getData.apply(null, args);
        }

        if (decodedData.includes("NaN")) {
            throw new Error('The encoded data contains "NaN", please check the input arguments');
        }
        return decodedData;
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

    /**
     * decode moac transaction logs
     *
     * [Reference](https://github.com/ConsenSys/abi-decoder/blob/master/index.js#L130)
     *
     * @param {ILogs} logs
     * @returns {IDecodedLogs}
     * @memberof MoacABI
     */
    public decodeLogs(logs: ILogs): IDecodedLogs {
        if (abiDecoder.getABIs().length === 0) {
            abiDecoder.addABI(this._abi);
        }
        return logs.filter((log) => log.topics.length > 0).map((logItem) => {
            const methodID = logItem.topics[0].slice(2);
            const method = abiDecoder.getMethodIDs()[methodID];
            if (method) {
                const logData = logItem.TxData;
                const decodedParams = [];
                let dataIndex = 0;
                let topicsIndex = 1;

                const dataTypes = [];
                method.inputs.map((input) => {
                    if (!input.indexed) {
                        dataTypes.push(input.type);
                    }
                });

                const decodedData = abiCoder.decodeParameters(dataTypes, logData.slice(2));

                // Loop topic and data to get the params
                method.inputs.map((param) => {
                    const decodedP: any = {
                        name: param.name,
                        type: param.type,
                    };

                    if (param.indexed) {
                        decodedP.value = logItem.topics[topicsIndex];
                        topicsIndex++;
                    } else {
                        decodedP.value = decodedData[dataIndex];
                        dataIndex++;
                    }

                    if (param.type === "address") {
                        decodedP.value = decodedP.value.toLowerCase();
                        // 42 because len(0x) + 40
                        if (decodedP.value.length > 42) {
                            const toRemove = decodedP.value.length - 42;
                            const temp = decodedP.value.split("");
                            temp.splice(2, toRemove);
                            decodedP.value = temp.join("");
                        }
                    }

                    if (param.type === "uint256" || param.type === "uint8" || param.type === "int") {
                        decodedP.value = new BN(decodedP.value).toString(10);
                    }

                    decodedParams.push(decodedP);
                });

                return {
                    address: logItem.address,
                    events: decodedParams,
                    name: method.name
                };
            }
        });
    }

    /**
     * destroy abis and methodIDs of abiDecoder
     *
     * @memberof MoacABI
     */
    public destroy() {
        abiDecoder.getABIs().length = 0;
        abiDecoder.getMethodIDs().length = 0;
    }
}

export { MoacABI };
