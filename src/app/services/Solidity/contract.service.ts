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
  '0x6b51Ed13d1Cf07488Bafee044A71013Ee75fa0B7'
);


export default bscContract;