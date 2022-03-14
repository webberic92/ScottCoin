import { Component, OnInit } from '@angular/core';
import bscContract from "src/app/services/Solidity/contract.service"
import Web3 from 'web3';
import { Web3Service } from 'src/app/services/Web3/web3.service';
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.scss']
})
export class NFTComponent implements OnInit {
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
  contractERC721Token: string = ''
  contractBnbBalance: string | void = ''

  numToBuy: string = '0';
  totalPrice: string = '0';
  purchaseString: string = ''
  error: string = ''
  constructor(private web3: Web3Service) { }

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
      this.contractOwner = await bscContract.methods.owner().call()
      this.contractERC721Token = await bscContract.methods.erc721Token().call()
      this.isLoading = false;
      this.userAddress = await this.web3.getAccounts()
      this.userAddress = Web3.utils.toChecksumAddress(this.userAddress[0])
      this.tokensOwned = await bscContract.methods.balanceOf(this.userAddress).call()
      this.tokensStaked = await bscContract.methods.stakeOf(this.userAddress).call()
      this.contractBnbBalance = Web3.utils.fromWei(await web3.eth.getBalance(this.contractAddress), 'ether')

    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

}
