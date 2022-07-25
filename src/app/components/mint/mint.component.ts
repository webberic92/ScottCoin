import { Component, OnInit } from '@angular/core';
import ethContract from "src/app/services/Solidity/contract.service"
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
      this.contractAddress = ethContract._address
      this.contractName = await ethContract.methods.name().call()
      this.contractSymbol = await ethContract.methods.symbol().call()
      this.contractMinted = await ethContract.methods.totalSupply().call()
      this.contractTotalSupply = await ethContract.methods.maxSupply().call()
      this.contractPrice = Web3.utils.fromWei(await ethContract.methods.cost().call(), 'ether')
      //this.isLoading = false;
      this.userAddress = await this.web3.getAccounts()
      this.tokensOwned = await ethContract.methods.balanceOf(this.userAddress[0]).call()
      this.contractOwner = await ethContract.methods.owner().call()
      this.isLoading = false;

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
      if (this.contractOwner == Web3.utils.toChecksumAddress(this.userAddress[0])) {
        await ethContract.methods.buy(this.numToBuy).send({
          from: this.userAddress[0],
        })
      } else {
        await ethContract.methods.buy(this.numToBuy).send({
          from: this.userAddress[0],
          value: Web3.utils.toWei(this.totalPrice, 'ether')
        })
      }


      this.isLoading = false;
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

}
