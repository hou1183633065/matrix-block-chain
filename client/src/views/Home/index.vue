<template>
  <div class="home">
    <ul>
      <li v-for="(item, index) in candidates" :key="index">
        <span> 姓名：{{item.name}}</span>
        <span>,共{{item.count}}票</span>
        <button @click="handleVoting(index)">投票</button>
      </li>
    </ul>
  </div>
</template>

<script>
import VotingContract from "../../contracts/Voting.json";
// import VotingAbi from "../../contracts/VotingAbi";
// import getWeb3 from "../../utils/getWeb3";
import BigNumber from "bignumber.js";
import Tx from "matrixjs-tx";

import HttpProvider from "../../utils/HttpProvider";
import { chainUrl, chainId, address } from "../../utils/config";

let httpProvider = new HttpProvider(chainUrl);

// MAN.49BW4sEgxkqriSMojnvyS4KEgGZFz
// hash:0x0467428bfa805084ea2cc16ab039c170bf825f3519ef98d4d25ca6ca5e4046dc
// 钱包私钥d9ff3266d3b5dad3af34e8d03fd9ac8f92ccc788694ef81c64747ebbdbc8463a
const contractManAdd = "MAN.49BW4sEgxkqriSMojnvyS4KEgGZFz";
const contractAddress =
  "0x0467428bfa805084ea2cc16ab039c170bf825f3519ef98d4d25ca6ca5e4046dc";

const privateKey = new Buffer(
  "d9ff3266d3b5dad3af34e8d03fd9ac8f92ccc788694ef81c64747ebbdbc8463a",
  "hex"
);

let contract = httpProvider.man
  .contract(VotingContract.abi)
  .at(contractAddress);

// let contract = httpProvider.man.contract(VotingAbi).at(contractAddress);

function getTxParams(data, rawTx) {
  let txData = new Tx(data, true);
  rawTx.v = "0x" + txData.v.toString("hex");
  rawTx.r = "0x" + txData.r.toString("hex");
  rawTx.s = "0x" + txData.s.toString("hex");
}

function getTotalVoting(name = "") {
  return new Promise(resolve => {
    let getParma = {
      to: contractManAdd,
      data: contract.votingTotalPerson.getData(name),
      currency: "MAN"
    };
    let resultData = httpProvider.man.call(getParma, "latest");
    console.log(resultData);

    resultData = resultData.length <= 2 ? "0x0" : resultData;
    resolve(httpProvider.toDecimal(resultData));
  });
}
export default {
  name: "home",
  components: {},
  data() {
    return {
      msg: "hello123",
      candidates: [
        {
          name: "houzhiqiang",
          count: 0
        },
        {
          name: "zhaozhengwu",
          count: 0
        },
        {
          name: "liyongjie",
          count: 0
        },
        {
          name: "wangfei",
          count: 0
        },
        {
          name: "zhangming",
          count: 0
        }
      ]
    };
  },
  mounted() {
    this.createContract();
    this.getAllpersonVoting();
  },
  methods: {
    createContract() {
      console.log(httpProvider);
      console.log(contract);
      let names = this.candidates.map(item => item.name);
      let createCode = contract.createVoting.getData(names);
      console.log(createCode);
      // let newArr = [
      //   "0x000000000000000000000000000000000005686f757a68697169616e67000000",
      //   "0x0000000000000000000000000000000000000000007a68616f7a68656e677775",
      //   "0x0000000000000000000000000000000000000000006c69796f6e676a69650000",
      //   "0x000000000000000000000000000000000000000000000077616e676665690000",
      //   "0x00000000000000000000000000000000000000000000007a68616e676d696e67"
      // ];

      let rawTx = {
        // to: contractManAdd,
        // from: address,
        value: 0,
        data: createCode,
        CommitTime: Date.now(),
        gas: 210000,
        gasPrice: httpProvider.toHex(httpProvider.man.gasPrice.toString()),
        nonce: 4503599627370496,
        extra_to: [[0, 0, []]],
        chainId
      };
      let nonce = httpProvider.man.getTransactionCount(address);
      rawTx.nonce = httpProvider.toHex(nonce);
      const tx = new Tx(rawTx);
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      let data = "0x" + serializedTx.toString("hex");

      getTxParams(data, rawTx); // set v,r,s
      rawTx.gas = httpProvider.toHex(rawTx.gas);
      rawTx["TxEnterType"] = 0;
      rawTx["IsEntrustTx"] = 0;
      rawTx["lockHeight"] = 0;
      rawTx["currency"] = "MAN";
      rawTx["txType"] = 0;
      rawTx["extra_to"] = [];
      rawTx.gas = httpProvider.toHex(new BigNumber(rawTx.gas).toString());
      rawTx.value = httpProvider.toHex(new BigNumber(rawTx.value).toString());
      console.log(rawTx);

      // httpProvider.man.sendTransaction({ data: createCode }, (err, address)=> {
      //   let receipt = httpProvider.man.getTransactionReceipt(contractAddress);
      //   console.log(receipt);
      // });
      httpProvider.man.sendRawTransaction(rawTx, (error, result) => {
        // let receipt = httpProvider.man.getTransactionReceipt(contractAddress);
        console.log(error, result);
      });
    },
    async handleVoting(index) {
      let name = this.candidates[index].name;
      let votingCode = contract.votingToPerson.getData(name);
      console.log(votingCode);

      let rawTx = {
        to: contractManAdd,
        from: address,
        value: 0,
        data: votingCode,
        CommitTime: Date.now(),
        gas: 210000,
        gasPrice: httpProvider.toHex(httpProvider.man.gasPrice.toString()),
        nonce: 4503599627370496,
        extra_to: [[0, 0, []]],
        chainId
      };
      let nonce = httpProvider.man.getTransactionCount(address);

      rawTx.nonce = httpProvider.toHex(nonce);
      // rawTx.nonce = httpProvider.toHex(new BigNumber(nonce).toString());
      const tx = new Tx(rawTx);
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      let data = "0x" + serializedTx.toString("hex");
      //reset rawtx
      getTxParams(data, rawTx); // set v,r,s
      rawTx.gas = httpProvider.toHex(rawTx.gas);
      rawTx["TxEnterType"] = 0;
      rawTx["IsEntrustTx"] = 0;
      rawTx["lockHeight"] = 0;
      rawTx["currency"] = "MAN";
      rawTx["txType"] = 0;
      rawTx["extra_to"] = [];
      rawTx.gas = httpProvider.toHex(new BigNumber(rawTx.gas).toString());
      rawTx.value = httpProvider.toHex(new BigNumber(rawTx.value).toString());

      httpProvider.man.sendRawTransaction(rawTx, async (error, result) => {
        console.log(error, result);
        // let receipt = httpProvider.man.getTransactionReceipt(contractAddress);
        // console.log(receipt);
        let resNum = await getTotalVoting(name);
        console.log(resNum);
        // this.candidates[index].count += 1;
      });
    },
    async getAllpersonVoting() {
      this.candidates = await this.getPersonTotalVoting(this.candidates);
    },
    async getPersonTotalVoting(list = []) {
      return new Promise(resolve => {
        list.map(async item => {
          item.count = await getTotalVoting(item.name);
          return item;
        });
        resolve(list);
      });
    }
  }
};
</script>
