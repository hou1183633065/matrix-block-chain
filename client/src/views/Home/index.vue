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
import getWeb3 from "../../utils/getWeb3";
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
console.log(contract);

function getTxParams(data, rawTx) {
  let txData = new Tx(data, true);
  rawTx.v = "0x" + txData.v.toString("hex");
  rawTx.r = "0x" + txData.r.toString("hex");
  rawTx.s = "0x" + txData.s.toString("hex");
}

function getTotalVoting(name = "") {
  return new Promise(resolve => {
    let getParma = {
      to: "MAN.468kLTuAEjm53ro2pPErnAAHqbccK",
      // to: "MAN.49BW4sEgxkqriSMojnvyS4KEgGZFz",
      data: contract.votingTotalPerson.getData(name),
      currency: "MAN"
    };
    let resultData = httpProvider.man.call(getParma, "latest");
    resultData = resultData.length <= 2 ? "0x0" : resultData;
    resolve(httpProvider.toDecimal(resultData));
  });
}
export default {
  name: "home",
  components: {},
  data() {
    return {
      msg: 'hello123',
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
    this.getAllpersonVoting();
  },
  methods: {
    async handleVoting(index) {
      console.log(index);
      // this.candidates = await this.getPersonTotalVoting(this.candidates);
      // this.getAllpersonVoting();
    },
    async getAllpersonVoting() {
      this.candidates = await this.getPersonTotalVoting(this.candidates);
    },
    async getPersonTotalVoting(list = []) {
      return new Promise(resolve => {
        list.map(async item => {
          item.count = await getTotalVoting(item.name);
          item.count++;
          return item;
        });
        resolve(list);
      });
    }
  }
};
</script>
