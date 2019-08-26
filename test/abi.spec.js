const Chain3 = require("chain3");
const erc20ABI = require("./abi/erc20ABI");
const erc721ABI = require("./abi/erc721ABI");
const MoacABI = require("../lib/abi").MoacABI;
const expect = require("chai").expect;

describe("test abi", function() {

  describe("test erc20 abi", function() {
    const chain3 = new Chain3(new Chain3.providers.HttpProvider("https://moac1ma17f1.jccdex.cn"));
    const contract = chain3.mc.contract(erc20ABI).at("0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2");
    const inst = new MoacABI(contract);

    describe("test encode & decode", function() {
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
            { name: '_value', value: '30000000000000000', type: 'uint256' }
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
            { name: '_value', value: '30000000000000000', type: 'uint256' }
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
            { name: '_value', value: '30000000000000000', type: 'uint256' }
          ]
        })
      })
    })
  })

  describe("test abi of erc721", function() {

    const chain3 = new Chain3(new Chain3.providers.HttpProvider("https://moac1ma17f1.jccdex.cn"));
    const contract = chain3.mc.contract(erc721ABI).at("0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2");
    const inst = new MoacABI(contract);

    describe("test encode & decode", function() {
      it("test safeTransferFrom without data", function() {
        const data = inst.encode("safeTransferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1);
        expect(data).to.equal("0x42842e0e000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
      })

      it("test safeTransferFrom with data", function() {
        const data = inst.encode("safeTransferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1, "0xaa");
        expect(data).to.equal("0xb88d4fde000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f87499971000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001aa00000000000000000000000000000000000000000000000000000000000000")
      })

      it("test mint", function() {
        const data = inst.encode("mint", "0x533243557dfdc87ae5bda885e22db00f87499971", 1, "https://jccdex.cn/1")
        expect(data).to.equal("0xd3fc9864000000000000000000000000533243557dfdc87ae5bda885e22db00f8749997100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001368747470733a2f2f6a63636465782e636e2f3100000000000000000000000000")
      })

      it("test burn", function() {
        const data = inst.encode("burn", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x9dc29fac000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
      })

      it("test transferFrom", function() {
        const data = inst.encode("transferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x23b872dd000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
      })

      it("test approve", function() {
        const data = inst.encode("approve", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x095ea7b3000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
      })

      it("test setApprovalForAll", function() {
        const data = inst.encode("setApprovalForAll", "0x533243557dfdc87ae5bda885e22db00f87499971", true)
        expect(data).to.equal("0xa22cb465000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
      })

    })
  })

})