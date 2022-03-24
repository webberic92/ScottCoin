import { Injectable } from '@angular/core';
const contract = require("../Solidity/bep20/ABI.json");
const Web3 = require('web3');
//testNet
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor() { }
}

web3.eth.setProvider(Web3.givenProvider);


const bscContract = new web3.eth.Contract(
  (contract.abi),
  '0x8Fc1eFB1B5F4E7c2FB3eA291B53AD5AdFa506b66'
);


export default bscContract;