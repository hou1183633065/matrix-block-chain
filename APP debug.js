import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./utils/getWeb3";
import BigNumber from 'bignumber.js'
import Tx from 'matrixjs-tx'

import HttpProvider from './utils/HttpProvider';
import { chainUrl, chainId, address } from "./utils/config";

import "./App.css";
import { encode, decode } from "punycode";

let httpProvider = new HttpProvider(chainUrl)
// MAN.49BW4sEgxkqriSMojnvyS4KEgGZFz
// hash:0x0467428bfa805084ea2cc16ab039c170bf825f3519ef98d4d25ca6ca5e4046dc
// 钱包私钥d9ff3266d3b5dad3af34e8d03fd9ac8f92ccc788694ef81c64747ebbdbc8463a
const contractManAdd = "MAN.49BW4sEgxkqriSMojnvyS4KEgGZFz"
const contractAddress = "0x0467428bfa805084ea2cc16ab039c170bf825f3519ef98d4d25ca6ca5e4046dc"

const privateKey = new Buffer('d9ff3266d3b5dad3af34e8d03fd9ac8f92ccc788694ef81c64747ebbdbc8463a', 'hex')

let contract = httpProvider.man.contract(VotingContract.abi).at(contractAddress);
console.log(contract);


function getTxParams(data, rawTx) {
  let txData = new Tx(data, true);
  rawTx.v = '0x' + txData.v.toString('hex');
  rawTx.r = '0x' + txData.r.toString('hex');
  rawTx.s = '0x' + txData.s.toString('hex');
};

function getTotalVoting(name = '') {
  return new Promise(resolve => {
    let getParma = {
      to: "MAN.468kLTuAEjm53ro2pPErnAAHqbccK",
      // to: "MAN.49BW4sEgxkqriSMojnvyS4KEgGZFz",
      data: contract.votingTotalPerson.getData(name),
      "currency": "MAN"
    }
    let resultData = httpProvider.man.call(getParma, "latest");
    resultData = resultData.length <= 2 ? "0x0" : resultData
    resolve(httpProvider.toDecimal(resultData))
  })
}
// 0xdc04977a2078c8ffdf086d618d1f961b6c546222
class App extends Component {
  // ["houzhiqiang", "zhaozhengwu", "liyongjie", "wangfei", "zhangming"]
  // [1,2,3,4,5]

  state = {
    storageValue: 0, web3: null, accounts: null, contract: null,
    candidates: [
      {
        id: 100,
        name: 'houzhiqiang',
        count: 0
      },
      {
        id: 101,
        name: 'zhaozhengwu',
        count: 0
      },
      {
        id: 102,
        name: 'liyongjie',
        count: 0
      },
      {
        id: 103,
        name: 'wangfei',
        count: 0
      },
      {
        id: 104,
        name: 'zhangming',
        count: 0
      },
    ]
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      // this.state.candidates = 
      this.getAllpersonVoting()

      // let newNum = contract.getNum.getData(1)
      // let name = "houzhiqiang"
      // let votingCode = contract.getNum.getData(12)
      // let rawTx = {
      //   to: address,
      //   value: 0,
      //   nonce: "",
      //   data: votingCode,
      //   CommitTime1: Date.now(),
      //   gas: 210000,
      //   gasPrice: httpProvider.toHex(httpProvider.man.gasPrice.toString()),
      //   nonce: 4503599627370496,
      //   extra_to: [[0, 0, []]],
      //   chainId: 3
      // }
      // console.log(httpProvider.toHex(0));

      // let nonce = httpProvider.man.getTransactionCount(address)
      // rawTx.nonce = httpProvider.toHex(new BigNumber(nonce).toString());
      // const tx = new Tx(rawTx);
      // tx.sign(privateKey);
      // const serializedTx = tx.serialize();
      // let data = "0x" + serializedTx.toString('hex');
      // //reset rawtx
      // getTxParams(data, rawTx); // set v,r,s
      // rawTx.gas = httpProvider.toHex(rawTx.gas);
      // rawTx['TxEnterType'] = 0;
      // rawTx['IsEntrustTx'] = 0;
      // rawTx['lockHeight'] = 0;
      // rawTx['currency'] = 'MAN';
      // rawTx['txType'] = 0;
      // rawTx['extra_to'] = [];
      // rawTx.gas = httpProvider.toHex(new BigNumber(rawTx.gas).toString());
      // rawTx.value = httpProvider.toHex(new BigNumber(rawTx.value).toString());

      // httpProvider.man.sendRawTransaction(rawTx, (error, result) => {
      //   console.log(error, result);

      // })

      // let votingCode1 = contract.getNum.getData(12)
      // let votingCode2 = contract.votingTotalPerson.getData(name)

      // console.log(votingCode1);
      // console.log(votingCode2);
      // httpProvider.man.getTransaction(contractAddress, (error, result) => {
      //   console.log(error, result);
      // })
      // httpProvider.man.sendTransaction({
      //   to: "MAN.3qbcHmLhLPvxtKUmdvTQwfyCfQP1c",
      //   // to: "MAN.2P65ZweS7AcYF4uUqqXKuXm6f22ug",
      //   currency: "MAN",
      //   data: votingCode1,
      // }, (error, result) => {
      //   console.log(error, result);
      // })
      // console.log(httpProvider.toHex("MAN.3qbcHmLhLPvxtKUmdvTQwfyCfQP1c"));
      // let result111 = getTotalVoting('houzhiqiang')
      // console.log(result111);

      // httpProvider.man.getTransactionCount(from, (error, nonce) => {

      //   console.log(rawTx);


      // })
      // httpProvider.man.getBalance("MAN.2P65ZweS7AcYF4uUqqXKuXm6f22ug", "latest", (error, result) => {
      //   console.log(error, result);

      // });
      // httpProvider.man.getCode("MAN.2P65ZweS7AcYF4uUqqXKuXm6f22ug", 'MAN', "latest", (error, result) => {
      //   console.log(error, result);

      // });

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // console.log(networkId);
      // console.log(VotingContract);
      // const deployedNetwork = VotingContract.networks[networkId];

      // const instance = new web3.eth.Contract(
      //   VotingContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      // // Set web3, accounts, and contract to the state, and then proceed with an
      // // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      // alert(
      //   `Failed to load web3, accounts, or contract. Check console for details.`,
      // );
      console.error(error);
    }
  };
  votingToPerson = async (name) => {
    console.log(11111);
    console.log(22, name);
    console.log(33, this);
    let newCandidates = await this.getPersonTotalVoting(this.state.candidates)
    this.setState({
      candidates: newCandidates
    })
  }
  getAllpersonVoting = async () => {
    let newCandidates = await this.getPersonTotalVoting(this.state.candidates)
    this.setState({
      candidates: newCandidates
    })
  }
  getPersonTotalVoting = async (list = []) => {
    return new Promise(resolve => {
      list.map(async item => {
        item.count = await getTotalVoting(item.name)
        item.count++
        return item
      });
      resolve(list)
    })
  }
  runExample = async () => {
    // MAN.3wuWG1b69EPjETcvx5LjSAJZD731R
    // hash:0x3c83b4d311de0f20b30988dc2c278c063c7c4c0434daff75808089a8ee747604

    const { accounts, contract } = this.state;
    console.log(accounts);
    console.log(contract);

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
    // console.log(this.state.storageValue);

  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        {
          this.state.candidates.map((person, index) => {
            return (
              <li key={person.id}>
                姓名：{person.name},共{person.count}票
                <button onClick={() => this.votingToPerson(person.name)}>投票</button>
              </li>
            )
          })
        }
      </div>
    );
  }
}

export default App;
