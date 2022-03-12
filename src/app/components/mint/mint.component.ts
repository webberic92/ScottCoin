import { Component, OnInit } from '@angular/core';
import bscContract from "src/app/services/Solidity/contract.service"
import Web3 from 'web3';
@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  constructor() {
  }

  async ngOnInit(): Promise<any> {
    this.contractAddress = bscContract._address
    try {
      this.contractName = await bscContract.methods.name().call()
      this.contractSymbol = await bscContract.methods.symbol().call()
      this.contractMinted = await bscContract.methods.totalSupply().call()
      this.contractTotalSupply = await bscContract.methods.maxSupply().call()
      this.contractPrice = Web3.utils.fromWei(await bscContract.methods.cost().call(), 'ether')


    } catch (e) {
      this.error = e.error
      console.log("error " + e)
    }

  }

  contractAddress: string = ''
  contractOwner: string = ''
  contractName: string = ''
  contractSymbol: string = ''
  contractMinted: string = ''
  contractTotalSupply: string = ''
  contractPrice: string = ''

  numToBuy: string = '0';
  totalPrice: string = '0';
  test: string = ''
  error: string = ''
  updatePrice(e: Event) { // without type info
    this.test = ''
    this.numToBuy = String(e);
    this.totalPrice = (Number(this.numToBuy) * Number(this.contractPrice)).toFixed(6)
    if (Number(this.numToBuy) >= 100000000000) {
      this.numToBuy = '0'
      this.totalPrice = '0'
    }
    if (isNaN(Number(this.totalPrice))) {
      this.numToBuy = '0';
      this.totalPrice = '0'
    }


  }


  buy() {
    this.test = "BUY " + this.numToBuy + " For " + this.totalPrice + " BNB"


  }

}
