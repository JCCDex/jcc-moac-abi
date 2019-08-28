# API

```javascript
/**
  * Creates an instance of MoacABI.
  * @todo if [pr](https://github.com/MOACChain/chain3/pull/14) and released, should use `contract instanceof Contract` to check input value if valid.
  * @param {*} contract moac contract instance
  * @memberof MoacABI
  */
  constructor(contract: any);
```

 ```javascript
 /**
  * moac contract instance
  *
  * @private
  * @type {*}
  * @memberof MoacABI
  */
  private _contract;
/**
  * moac abi
  *
  * @private
  * @type {any[]}
  * @memberof MoacABI
  */
  private _abi;
/**
  * encode the input value by function name
  *
  * @param {string} name defined function name in the abi
  * @param {*} args parameters according to the defined inputs
  * @returns {string}
  * @memberof MoacABI
  */
  encode(name: string, ...args: any[]): string;
/**
  * decode the input value
  *
  * @param {string} data
  * @returns {*}
  * @memberof MoacABI
  */
  decode(data: string): any;
/**
  * decode moac transaction logs
  *
  * [Reference](https://github.com/ConsenSys/abi-decoder/blob/master/index.js#L130)
  *
  * @param {ILogs} logs
  * @returns {IDecodedLogs}
  * @memberof MoacABI
  */
  decodeLogs(logs: ILogs): IDecodedLogs;
/**
  * add abi to abiDecoder
  *
  * @param {any[]} abis
  * @memberof MoacABI
  */
addABI(abi: any[]): void;
/**
  * destroy abis and methodIDs of abiDecoder
  *
  * @memberof MoacABI
  */
  destroy(): void;
```
