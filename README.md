# jcc-moac-abi

Decoder and encoder for the MOAC ABI and decode events from MOAC transactions.

![npm](https://img.shields.io/npm/v/jcc-moac-abi.svg)
[![Build Status](https://travis-ci.com/JCCDex/jcc-moac-abi.svg?branch=master)](https://travis-ci.com/JCCDex/jcc-moac-abi)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc-moac-abi/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc-moac-abi?branch=master)
[![Dependencies](https://img.shields.io/david/JCCDex/jcc-moac-abi.svg?style=flat-square)](https://david-dm.org/JCCDex/jcc-moac-abi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Installtion

```shell
npm i jcc-moac-abi
```

## API

[APIs](https://github.com/JCCDex/jcc-moac-abi/blob/master/docs/API.md)

## How to use

See test/abi.spec.js for detail.

参见 test/abi.spec.js 获得更多细节信息

jcc-moac-abi的作用是将合约调用演化为对函数名，参数的字符串拼接，类似call by name的方式对合约进行调用。这种方式极大的简化了对合约调用的封装工作。

```javascript
...
const Chain3 = require("chain3");
const MoacABI = require("jcc-moac-abi").MoacABI;
const erc20ABI = require("./abi/erc20ABI");
const erc721ABI = require("./abi/erc721ABI");
...

// 建立起合约的实例
const chain3 = new Chain3(new Chain3.providers.HttpProvider("https://moac1ma17f1.jccdex.cn"));
const contract = chain3.mc.contract(erc20ABI).at("0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2");
const inst = new MoacABI(contract);

// 获取交易的data部分
const data = inst.encode("transfer", "0x533243557dfdc87ae5bda885e22db00f87499971", "30000000000000000")
// 接下来就是signTransaction这些工作了

```
