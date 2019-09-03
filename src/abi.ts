import abiDecoder = require("abi-decoder");
import isArray = require("lodash/isArray");
import isFunction = require("lodash/isFunction");
import isObject = require("lodash/isObject");
import abiCoder = require("web3-eth-abi");
import { BN } from "web3-utils";
import { IABIItem, IDecoded, IDecodedLog, ILog } from "./model";

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
     * @type {IABIItem[]}
     * @memberof MoacABI
     */
    private _abi: IABIItem[];

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
     * get item of function meta data
     *
     * @param {string} name defined function name in the abi
     * @param {*} args parameters according to the defined inputs
     * @returns {any}
     * @memberof MoacABI
     */
    public getAbiItem = (name: string, ...args): IABIItem => {
        const method: any = this._contract[name];
        if (!isFunction(method)) {
            throw new Error(`The contract doesn't contain "${name}" function`);
        }
        const filterABIs: IABIItem[] = this._abi.filter((item) => item.name === name);
        let abi: IABIItem;
        if (filterABIs.length === 1) {
            abi = filterABIs[0];
        } else {
            abi = filterABIs.find((item) => item.inputs.length === args.length);
            if (!abi) {
                throw new Error("Invalid number of arguments to Solidity function");
            }
        }

        return abi;
    }

    /**
     * encode the input value by function name
     *
     * @param {string} name defined function name in the abi
     * @param {*} args parameters according to the defined inputs
     * @returns {string}
     * @memberof MoacABI
     */
    public encode = (name: string, ...args): string => {
        const method: any = this._contract[name];
        if (!isFunction(method)) {
            throw new Error(`The contract doesn't contain "${name}" function`);
        }
        const filterABIs: IABIItem[] = this._abi.filter((item) => item.name === name);
        let encodedData: string;
        if (filterABIs.length === 1) {
            encodedData = method["getData"].apply(null, args);
        } else {
            const abi: IABIItem = filterABIs.find((item) => item.inputs.length === args.length);
            if (!abi) {
                throw new Error("Invalid number of arguments to Solidity function");
            }

            // detail: https://github.com/MOACChain/chain3/blob/master/lib/chain3/function.js#L282
            const typename = abi.inputs.map((input) => input.type).join(",");
            encodedData = method[typename].getData.apply(null, args);
        }

        if (encodedData.includes("NaN")) {
            throw new Error('The encoded data contains "NaN", please check the input arguments');
        }
        return encodedData;
    }

    /**
     * decode the input value
     *
     * @param {string} data
     * @returns {IDecoded[]}
     * @memberof MoacABI
     */
    public decode = (data: string): IDecoded[] => {
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
     * @param {ILog[]} logs
     * @returns {IDecodedLog[]} if event is defined and decode succeed, return log that contains
     * events as input arguments and name as event's name, otherwise return itself.
     * @memberof MoacABI
     */
    public decodeLogs = (logs: ILog[]): IDecodedLog[] => {
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

                return Object.assign(logItem, { events: decodedParams, name: method.name });
            }
            return logItem;
        });
    }

    /**
     * add abi to abiDecoder
     *
     * @param {IABIItem[]} abis
     * @memberof MoacABI
     */
    public addABI(abi: IABIItem[]) {
        abiDecoder.addABI(abi);
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
