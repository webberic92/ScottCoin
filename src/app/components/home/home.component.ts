import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import bscContract from 'src/app/services/Solidity/contract.service';
import Chart from 'chart.js/auto';
import Web3 from 'web3';
import { Web3Service } from 'src/app/services/Web3/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  contractName: string = '';

  // constructor(private router: Router) {

  // }
  // async ngOnInit(): Promise<void> {
  //   try {
  //     this.contractName = await bscContract.methods.name().call()
  //   } catch (e) {
  //     console.log(e)

  //   }
  // }

  // mint = () => {
  //   this.router.navigateByUrl('/mint');
  // };
  // manage = () => {
  //   this.router.navigateByUrl('/manage');
  // };
  // nft = () => {
  //   this.router.navigateByUrl('/nft');
  // };
  // team = () => {
  //   this.router.navigateByUrl('/team');
  // };

  // roadmap = () => {
  //   this.router.navigateByUrl('/roadmap');
  // };

  constructor(private web3: Web3Service) {}
  tokensOwned: string = '';
  tokensStaked: string = '';

  isLoading: boolean = false;
  userAddress: string = '';
  contractAddress: string = '';
  contractOwner: string = '';
  // contractName: string = ''
  contractSymbol: string = '';
  contractMinted: string = '';
  contractTotalSupply: string = '';
  contractPrice: string = '';
  numToBuy: string = '0';
  totalPrice: string = '0';
  purchaseString: string = '';
  error: string = '';

  async ngOnInit(): Promise<any> {
    this.getContent();
  }
  async getContent() {
    try {
      this.isLoading = true;
      this.error = '';
      this.contractAddress = bscContract._address;
      this.contractName = await bscContract.methods.name().call();
      this.contractSymbol = await bscContract.methods.symbol().call();
      this.contractMinted = await bscContract.methods.totalSupply().call();
      this.contractTotalSupply = await bscContract.methods.maxSupply().call();
      this.contractPrice = Web3.utils.fromWei(
        await bscContract.methods.cost().call(),
        'ether'
      );
      this.userAddress = await this.web3.getAccounts();
      this.tokensOwned = await bscContract.methods
        .balanceOf(this.userAddress[0])
        .call();
      // console.log("TEST TowkensOwnded = " + this.tokensOwned)
      this.contractOwner = await bscContract.methods.owner().call();
      this.isLoading = false;
    } catch (e) {
      this.error = e.message;
      this.isLoading = false;
    }
  }

  updatePrice(e: Event) {
    // without type info
    this.purchaseString = '';
    this.numToBuy = String(e);
    this.totalPrice = (
      Number(this.numToBuy) * Number(this.contractPrice)
    ).toFixed(6);
    if (Number(this.numToBuy) >= 100000000000) {
      this.numToBuy = '0';
      this.totalPrice = '0';
    }
    if (isNaN(Number(this.totalPrice))) {
      this.numToBuy = '0';
      this.totalPrice = '0';
    }
  }

  async buy() {
    this.isLoading = true;
    try {
      if (
        this.contractOwner == Web3.utils.toChecksumAddress(this.userAddress[0])
      ) {
        await bscContract.methods.buy(this.numToBuy).send({
          from: this.userAddress[0],
        });
      } else {
        await bscContract.methods.buy(this.numToBuy).send({
          from: this.userAddress[0],
          value: Web3.utils.toWei(this.totalPrice, 'ether'),
        });
      }
      this.isLoading = false;
      this.getContent();
    } catch (e) {
      this.error = e.message;
      this.isLoading = false;

      // }
    }
  }
}
