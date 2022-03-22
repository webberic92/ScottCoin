import { Injectable } from '@angular/core';
const contract = require("../services/Solidity/bep721/Abi.json");
const Web3 = require('web3');
//testNet
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor() { }
}

web3.eth.setProvider(Web3.givenProvider);


const NFTContract = new web3.eth.Contract(
  (contract.abi),
  '0xd77bb2e6FA41Cf04290BCe9A68f0e2f414e9E195'
);


export default NFTContract;