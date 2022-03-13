import { Injectable } from '@angular/core';
const contract = require("../Solidity/Abi.json");
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
  '0xf4a085B3d7A6720A6Eb1e0820E3C425156fAcD3e'
);


export default bscContract;