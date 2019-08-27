<template>
  <div class="home">
    <el-button type="primary" @click="createContract">创建投票</el-button>
    <el-button type="success" @click="getAllpersonVoting">查询投票</el-button>
      <el-table
        class="tables"
        :data="candidates"
        border
        style="width: 420px;">
        <el-table-column
          align="center"
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          label="总票数"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button  type="warning" size="small" @click="handleVoting(scope.$index)">{{scope.count}}投票</el-button>
          </template>
        </el-table-column>
      </el-table>
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

// MAN.2Vziwdup6Ba3H6EC3Sn4ghCVM2Gpg
// hash:0x7ae80ea496f970163e19cad54ba0b3eceb580dd65d8a4a7c07fecb3e9e8ab551
// 合约MAN地址
const contractManAdd = "MAN.2Vziwdup6Ba3H6EC3Sn4ghCVM2Gpg";
// 合约hash地址
const contractAddress =
  "0x7ae80ea496f970163e19cad54ba0b3eceb580dd65d8a4a7c07fecb3e9e8ab551";

// 钱包私钥d9ff3266d3b5dad3af34e8d03fd9ac8f92ccc788694ef81c64747ebbdbc8463a
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

function demandTransactionStatus(hash) {
  console.log("当前交易hash", hash);

  return new Promise(resolve => {
    function getTransactionReceipt() {
      httpProvider.man.getTransactionReceipt(hash, (err, result) => {
        if (!result) {
          setTimeout(() => {
            getTransactionReceipt();
          }, 1000);
        } else {
          resolve(result);
        }
      });
    }
    getTransactionReceipt();
  });
}
export default {
  components: {},
  data() {
    return {
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
    let code = contract.getNum.getData(2);
    console.log(code);
    let getParma = {
      to: contractManAdd,
      data: code,
      currency: "MAN"
    };
    let resultData = httpProvider.man.call(getParma, "latest");
    console.log(resultData);

    let mining = httpProvider.man.mining;
    console.log(mining);
    let coinbase = httpProvider.man.coinbase;
    console.log(coinbase);
  },
  methods: {
    createContract() {
      let names = this.candidates.map(item => item.name);
      let createCode = contract.createVoting.getData(names);
      let rawTx = {
        // 合约地址
        to: contractManAdd,
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
      console.log(nonce);
      
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
      httpProvider.man.sendRawTransaction(rawTx, async (error, result) => {
        if (!error) {
          let newData = await demandTransactionStatus(result);
          console.log("创建成功");
          console.log(newData);
        } else {
          console.log(error);
        }
      });
    },
    async handleVoting(index) {
      
      let name = this.candidates[index].name;
      console.log(name);
      let votingCode = contract.votingToPerson.getData(name);
      console.log(votingCode);

      let rawTx = {
        to: contractManAdd,
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
        if (!error) {
          let newData = await demandTransactionStatus(result);
          console.log("投票成功");
          console.log(newData);
          let resNum = await getTotalVoting(name);
          console.log("查询个人投票成功");
          console.log(resNum);
          this.candidates[index].count = resNum;
        } else {
          console.log(error);
        }
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


<style lang="stylus">
.home {
  .tables {
    margin: 20px auto;
  }
}
</style>
