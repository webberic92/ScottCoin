import { Component, OnInit } from '@angular/core';
import bscContract from "src/app/services/Solidity/contract.service"
import Web3 from 'web3';
import { Web3Service } from 'src/app/services/Web3/web3.service';

import { Store } from '@ngrx/store';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  constructor(private web3: Web3Service) {

  }
  tokensOwned: string = ''
  tokensStaked: string = ''

  isLoading: boolean = false;
  userAddress: string = ''
  contractAddress: string = ''
  contractOwner: string = ''
  contractName: string = ''
  contractSymbol: string = ''
  contractMinted: string = ''
  contractTotalSupply: string = ''
  contractPrice: string = ''
  numToBuy: string = '0';
  totalPrice: string = '0';
  purchaseString: string = ''
  error: string = ''

  async ngOnInit(): Promise<any> {
    this.getContent()

  }
  async getContent() {
    try {
      this.isLoading = true;
      this.contractAddress = bscContract._address
      this.contractName = await bscContract.methods.name().call()
      this.contractSymbol = await bscContract.methods.symbol().call()
      this.contractMinted = await bscContract.methods.totalSupply().call()
      this.contractTotalSupply = await bscContract.methods.maxSupply().call()
      this.contractPrice = Web3.utils.fromWei(await bscContract.methods.cost().call(), 'ether')
      this.isLoading = false;
      console.log("test")
      this.userAddress = await this.web3.getAccounts()
      // console.log("test2")
      // console.log(this.web3)
      console.log(this.userAddress)
      // console.log(this.userAddress[0])
      // this.tokensOwned = await bscContract.methods.balanceOf(this.userAddress[0]).call()
      // console.log("test3")

      // this.tokensStaked = await bscContract.methods.stakeOf(this.userAddress[0]).call()
      // console.log("test4")



    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }




  updatePrice(e: Event) { // without type info
    this.purchaseString = ''
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


  async buy() {
    this.isLoading = true;
    try {
      await bscContract.methods.buy(this.numToBuy).send({
        from: this.userAddress[0],
        value: Web3.utils.toWei(this.totalPrice, 'ether')
      })
      this.isLoading = false;
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

}
