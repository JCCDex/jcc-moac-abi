const Chain3 = require("chain3");
const MoacABI = require("../lib/abi").MoacABI;
const erc20ABI = require("./abi/erc20ABI");
const erc721ABI = require("./abi/erc721ABI");
const expect = require("chai").expect;

describe("test abi", function() {


  describe("test constructor", function() {
    it("throw error if input value is invalid", function() {
      expect(() => new MoacABI()).throw("The input value isn't a contract instance");
    })
  })

  describe("test erc20 abi", function() {

    describe("test encode & decode", function() {

      const chain3 = new Chain3(new Chain3.providers.HttpProvider("https://moac1ma17f1.jccdex.cn"));
      const contract = chain3.mc.contract(erc20ABI).at("0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2");
      const inst = new MoacABI(contract);

      this.afterAll(() => {
        inst.destroy()
      })

      it("test transfer", function() {
        const data = inst.encode("transfer", "0x533243557dfdc87ae5bda885e22db00f87499971", "30000000000000000")
        expect(data).to.equal("0xa9059cbb000000000000000000000000533243557dfdc87ae5bda885e22db00f87499971000000000000000000000000000000000000000000000000006a94d74f430000")
        const decoded = inst.decode(data);
        expect(decoded).to.deep.equal({
          name: 'transfer',
          params: [{
              name: '_to',
              value: '0x533243557dfdc87ae5bda885e22db00f87499971',
              type: 'address'
            },
            {
              name: '_value',
              value: '30000000000000000',
              type: 'uint256'
            }
          ]
        })
      })

      it("test approve", function() {
        const data = inst.encode("approve", "0x09344477fdc71748216a7b8bbe7f2013b893def8", "30000000000000000");
        expect(data).to.equal("0x095ea7b300000000000000000000000009344477fdc71748216a7b8bbe7f2013b893def8000000000000000000000000000000000000000000000000006a94d74f430000")
        const decoded = inst.decode(data);
        expect(decoded).to.deep.equal({
          name: 'approve',
          params: [{
              name: '_spender',
              value: '0x09344477fdc71748216a7b8bbe7f2013b893def8',
              type: 'address'
            },
            {
              name: '_value',
              value: '30000000000000000',
              type: 'uint256'
            }
          ]
        })
      })

      it("test transferFrom", function() {
        const data = inst.encode("transferFrom", "0x09344477fdc71748216a7b8bbe7f2013b893def8", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "30000000000000000");
        expect(data).to.equal("0x23b872dd00000000000000000000000009344477fdc71748216a7b8bbe7f2013b893def8000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000000000000000000000000000006a94d74f430000")
        const decoded = inst.decode(data);
        expect(decoded).to.deep.equal({
          name: 'transferFrom',
          params: [{
              name: '_from',
              value: '0x09344477fdc71748216a7b8bbe7f2013b893def8',
              type: 'address'
            },
            {
              name: '_to',
              value: '0xae832592b6d697cd6b3d053866bfe5f334e7c667',
              type: 'address'
            },
            {
              name: '_value',
              value: '30000000000000000',
              type: 'uint256'
            }
          ]
        })
      })

      it("test Tansfer event", function() {
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

        const decodedLogs = inst.decodeLogs(logs);
        expect(decodedLogs).to.deep.equal([{
          "name": "Transfer",
          "events": [{
              "name": "_from",
              "type": "address",
              "value": "0x687f6ab056708fcfd34b3226c0b70ddf95b2eab2"
            },
            {
              "name": "_to",
              "type": "address",
              "value": "0x66c9b619215db959ec137ede6b96f3fa6fd35a8a"
            },
            {
              "name": "_value",
              "type": "uint256",
              "value": "6990000000000000000000"
            }
          ],
          "address": "0x4c6007cea426e543551f2cb6392e6d6768f74706"
        }]);
      })

      it("throw error if doesn't contain function", function() {
        expect(() => inst.encode("test")).throw('The contract doesn\'t contain "test" function');
      })

      it("throw error if decoded data contains 'NaN'", function() {
        expect(() => inst.encode("transfer", "533243557dfdc87ae5bda885e22db00f87499971", "30000000000000000")).throw('The decoded data contains "NaN", please check the input arguments');
      })
    })
  })

  describe("test abi of erc721", function() {

    describe("test encode & decode", function() {

      const chain3 = new Chain3(new Chain3.providers.HttpProvider("https://moac1ma17f1.jccdex.cn"));
      const contract = chain3.mc.contract(erc721ABI).at("0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2");
      const inst = new MoacABI(contract);

      this.afterAll(() => {
        inst.destroy()
      })

      it("test safeTransferFrom without data", function() {
        const data = inst.encode("safeTransferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1);
        expect(data).to.equal("0x42842e0e000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(inst.decode(data)).to.deep.equal({
          name: 'safeTransferFrom',
          params: [{
              name: '_from',
              value: '0xae832592b6d697cd6b3d053866bfe5f334e7c667',
              type: 'address'
            },
            {
              name: '_to',
              value: '0x533243557dfdc87ae5bda885e22db00f87499971',
              type: 'address'
            },
            {
              name: '_tokenId',
              value: '1',
              type: 'uint256'
            }
          ]
        })
      })

      it("test safeTransferFrom with data", function() {
        const data = inst.encode("safeTransferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1, "0xaa");
        expect(data).to.equal("0xb88d4fde000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f87499971000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001aa00000000000000000000000000000000000000000000000000000000000000")
        expect(inst.decode(data)).to.deep.equal({
          name: 'safeTransferFrom',
          params: [{
              name: '_from',
              value: '0xae832592b6d697cd6b3d053866bfe5f334e7c667',
              type: 'address'
            },
            {
              name: '_to',
              value: '0x533243557dfdc87ae5bda885e22db00f87499971',
              type: 'address'
            },
            {
              name: '_tokenId',
              value: '1',
              type: 'uint256'
            },
            {
              name: '_data',
              value: '0xaa',
              type: 'bytes'
            }
          ]
        })
      })

      it("test mint", function() {
        const data = inst.encode("mint", "0x533243557dfdc87ae5bda885e22db00f87499971", 1, "https://jccdex.cn/1")
        expect(data).to.equal("0xd3fc9864000000000000000000000000533243557dfdc87ae5bda885e22db00f8749997100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001368747470733a2f2f6a63636465782e636e2f3100000000000000000000000000")
        expect(inst.decode(data)).to.deep.equal({
          name: 'mint',
          params: [{
              name: '_to',
              value: '0x533243557dfdc87ae5bda885e22db00f87499971',
              type: 'address'
            },
            {
              name: '_tokenId',
              value: '1',
              type: 'uint256'
            },
            {
              name: '_uri',
              value: 'https://jccdex.cn/1',
              type: 'string'
            }
          ]
        })
      })

      it("test burn", function() {
        const data = inst.encode("burn", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x9dc29fac000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(inst.decode(data)).to.deep.equal({
          name: 'burn',
          params: [{
              name: '_owner',
              value: '0x533243557dfdc87ae5bda885e22db00f87499971',
              type: 'address'
            },
            {
              name: '_tokenId',
              value: '1',
              type: 'uint256'
            }
          ]
        })
      })

      it("test transferFrom", function() {
        const data = inst.encode("transferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x23b872dd000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(inst.decode(data)).to.deep.equal({
          name: 'transferFrom',
          params: [{
              name: '_from',
              value: '0xae832592b6d697cd6b3d053866bfe5f334e7c667',
              type: 'address'
            },
            {
              name: '_to',
              value: '0x533243557dfdc87ae5bda885e22db00f87499971',
              type: 'address'
            },
            {
              name: '_tokenId',
              value: '1',
              type: 'uint256'
            }
          ]
        })
      })

      it("test approve", function() {
        const data = inst.encode("approve", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x095ea7b3000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(inst.decode(data)).to.deep.equal({
          name: 'approve',
          params: [{
              name: '_approved',
              value: '0x533243557dfdc87ae5bda885e22db00f87499971',
              type: 'address'
            },
            {
              name: '_tokenId',
              value: '1',
              type: 'uint256'
            }
          ]
        })
      })

      it("test setApprovalForAll", function() {
        const data = inst.encode("setApprovalForAll", "0x533243557dfdc87ae5bda885e22db00f87499971", true)
        expect(data).to.equal("0xa22cb465000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(inst.decode(data)).to.deep.equal({
          name: 'setApprovalForAll',
          params: [{
              name: '_operator',
              value: '0x533243557dfdc87ae5bda885e22db00f87499971',
              type: 'address'
            },
            {
              name: '_approved',
              value: true,
              type: 'bool'
            }
          ]
        })
      })

      it("throw error if number of arguments is invalid", function() {
        expect(() => inst.encode("safeTransferFrom", "0x533243557dfdc87ae5bda885e22db00f87499971", true)).throw('Invalid number of arguments to Solidity function');
      })

    })
  })

})