# API

```javascript
/**
  * Creates an instance of MoacABI.
  * @param {Contract} contract moac contract instance
  * @memberof MoacABI
  */
  constructor(contract: Contract);
```

 ```javascript
 /**
  * moac contract instance
  *
  * @private
  * @type {Contract}
  * @memberof MoacABI
  */
  private _contract;
/**
  * moac abi
  *
  * @private
  * @type {IABIItem[]}
  * @memberof MoacABI
  */
  private _abi;

/**
 * get item of function meta data
 *
 * @param {string} name defined function name in the abi
 * @param {*} args parameters according to the defined inputs
 * @returns {IABIItem}
 * @memberof MoacABI
 */
  getAbiItem(name: string, ...args: any[]): IABIItem;

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
  * @static
  * @param {string} data
  * @returns {IDecoded[]}
  * @memberof MoacABI
  */
  static decode(data: string): IDecoded[];

/**
  * decode moac transaction logs
  *
  * [Reference](https://github.com/ConsenSys/abi-decoder/blob/master/index.js#L130)
  *
  * @static
  * @param {ILog[]} logs
  * @returns {IDecodedLog[]} if event is defined and decode succeed, return log that contains
  * events as input arguments and name as event's name, otherwise return itself.
  * @memberof MoacABI
  */
  static decodeLogs(logs: ILog[]): IDecodedLog[];

/**
  * add abi to abiDecoder
  *
  * @static
  * @param {IABIItem[]} abi
  * @memberof MoacABI
  */
  static addABI(abi: IABIItem[]): void;

/**
  * remove ABIs and methodIDs from abiDecoder
  *
  * @static
  * @param {IABIItem[]} abi
  * @memberof MoacABI
  */
  static removeABI(abi: IABIItem[]): void;
```
