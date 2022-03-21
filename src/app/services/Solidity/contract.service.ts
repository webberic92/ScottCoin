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
  '0xD2a2eBb7A985647D05eb1d5b383c38CDEE644Fc4'
);


export default bscContract;