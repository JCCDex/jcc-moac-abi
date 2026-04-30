import { Interface } from "ethers";
import { Contract } from "chain3/lib/chain3/contract";
import isFunction = require("lodash/isFunction");
import { IABIItem, IDecoded, IDecodedLog, ILog } from "./model";

// Global ABI registry (replaces abi-decoder)
const _abis: IABIItem[] = [];
let _iface: Interface | null = null;

function _getIface(): Interface {
    if (!_iface) {
        _iface = new Interface(_abis as any[]);
    }
    return _iface;
}

function _convertValue(value: any, type: string): any {
    if (typeof value === "bigint") {
        return value.toString();
    }
    if (type === "address") {
        return String(value).toLowerCase();
    }
    return value;
}

// Topics in MOAC logs may not always be zero-padded to 32 bytes.
// Ethers requires 32-byte hex topics, so we pad them before decoding.
function _padTopic(topic: string): string {
    return topic.length < 66 ? "0x" + topic.slice(2).padStart(64, "0") : topic;
}

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
     * @type {Contract}
     * @memberof MoacABI
     */
    private _contract: Contract;

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
     * @param {Contract} contract moac contract instance
     * @memberof MoacABI
     */
    constructor(contract: Contract) {
        if (contract instanceof Contract) {
            this._contract = contract;
            this._abi = contract.abi;
        } else {
            throw new Error("The input value isn't a contract instance");
        }
    }

    /**
     * get item of function meta data
     *
     * @param {string} name defined function name in the abi
     * @param {*} args parameters according to the defined inputs
     * @returns {IABIItem}
     * @memberof MoacABI
     */
    public getAbiItem = (name: string, ...args): IABIItem => {
        const method = this._contract[name];
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
        const method = this._contract[name];
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
     * @static
     * @param {string} data
     * @returns {IDecoded[]}
     * @memberof MoacABI
     */
    public static decode(data: string): IDecoded[] {
        const parsed = _getIface().parseTransaction({ data });
        return {
            name: parsed.name,
            params: parsed.fragment.inputs.map((input, i) => ({
                name: input.name,
                value: _convertValue(parsed.args[i], input.type),
                type: input.type,
            })),
        } as any;
    }

    /**
     * decode moac transaction logs
     *
     * @static
     * @param {ILog[]} logs
     * @returns {IDecodedLog[]} if event is defined and decode succeed, return log that contains
     * events as input arguments and name as event's name, otherwise return itself.
     * @memberof MoacABI
     */
    public static decodeLogs(logs: ILog[]): IDecodedLog[] {
        const iface = _getIface();
        return logs.filter((log) => log.topics.length > 0).map((logItem) => {
            const paddedTopics = logItem.topics.map(_padTopic);
            const parsed = iface.parseLog({ topics: paddedTopics, data: logItem.TxData });
            if (parsed) {
                const decodedParams = parsed.fragment.inputs.map((input, i) => ({
                    name: input.name,
                    type: input.type,
                    value: _convertValue(parsed.args[i], input.type),
                }));
                return Object.assign(logItem, { events: decodedParams, name: parsed.name });
            }
            return logItem;
        });
    }

    /**
     * add abi to registry
     *
     * @static
     * @param {IABIItem[]} abi
     * @memberof MoacABI
     */
    public static addABI(abi: IABIItem[]) {
        _abis.push(...abi);
        _iface = null;
    }

    /**
     * remove all ABIs from registry
     *
     * @static
     * @param {IABIItem[]} abi
     * @memberof MoacABI
     */
    public static removeABI(_abi: IABIItem[]) {
        _abis.length = 0;
        _iface = null;
    }
}

export { MoacABI };
