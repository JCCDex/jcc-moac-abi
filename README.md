# jcc-moac-abi

Decoder and encoder for the MOAC ABI and decode events from MOAC transactions.

![npm](https://img.shields.io/npm/v/jcc-moac-abi.svg)
[![Build Status](https://travis-ci.com/JCCDex/jcc-moac-abi.svg?branch=master)](https://travis-ci.com/JCCDex/jcc-moac-abi)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc-moac-abi/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc-moac-abi?branch=master)
[![Dependencies](https://img.shields.io/david/JCCDex/jcc-moac-abi.svg?style=flat-square)](https://david-dm.org/JCCDex/jcc-moac-abi)
[![npm downloads](https://img.shields.io/npm/dm/jcc-moac-abi.svg)](http://npm-stat.com/charts.html?package=jcc-moac-abi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Installtion

```shell
npm i jcc-moac-abi
```

## API

[APIs](https://github.com/JCCDex/jcc-moac-abi/blob/master/docs/API.md)

## How to use

See [abi.spec.js](https://github.com/JCCDex/jcc-moac-abi/blob/master/test/abi.spec.js) for details.

参见[abi.spec.js](https://github.com/JCCDex/jcc-moac-abi/blob/master/test/abi.spec.js)获得更多细节信息

jcc-moac-abi的作用是将合约调用演化为对函数名，参数的字符串拼接，类似call by name的方式对合约进行调用。这种方式极大的简化了对合约调用的封装工作。

```javascript
const Chain3 = require("chain3");
const MoacABI = require("jcc-moac-abi").MoacABI;
const erc20ABI = require("./test/abi/erc20ABI");

// for encoding

// create contract instance
const chain3 = new Chain3(new Chain3.providers.HttpProvider("https://moac1ma17f1.jccdex.cn"));
const contract = chain3.mc.contract(erc20ABI).at("0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2");

const moacABI = new MoacABI(contract);
// encode
const data = moacABI.encode("transfer", "0x533243557dfdc87ae5bda885e22db00f87499971", "30000000000000000")


// for decoding data and transaction logs

// add abi to abiDecoder firstly
MoacABI.addABI(erc20ABI);

// decode
const decode = MoacABI.decode(data);

// decode transaction logs
const logs = [{
    TxData: "0x00000000000000000000000000000000000000000000017aedbc9d648c780000",
    address: "0x4c6007cea426e543551f2cb6392e6d6768f74706",
    blockHash: "0x181c92ab726131010021473d6e444d2f682e013eb12b2d4faa0946a8847c56f1",
    blockNumber: 3175749,
    logIndex: 0,
    removed: false,
    topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x000000000000000000000000687f6ab056708fcfd34b3226c0b70ddf95b2eab2", "0x00000000000000000000000066c9b619215db959ec137ede6b96f3fa6fd35a8a"],
    transactionHash: "0x9a7da10a30ad4c8e1bb4461107497130a19f53a844069dd3e019557ee1a423b8",
    transactionIndex: 1
}];
const decodeLogs = MoacABI.decodeLogs(logs);


// remove ABIs and methodIDs from abiDecoder
MoacABI.removeABI(erc20ABI);

```
