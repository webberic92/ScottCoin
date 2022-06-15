import { Injectable } from '@angular/core';
const contract = require("./bep721/Abi.json");
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
  '0xF989A42c03dB7a5EE0c6a6b0d0dD6329B096aDe6'
);


export default NFTContract;