import { Component, OnInit } from '@angular/core';
import nftContract from "src/app/services/nft.service"
import Web3 from 'web3';
import { Web3Service } from 'src/app/services/Web3/web3.service';
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import bscContract from "src/app/services/Solidity/contract.service"
import { TestBed } from '@angular/core/testing';

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
  userNFTs: number[] = []
  userStakedNFTs: number[] = []

  contractTotalSupply: string = ''
  contractPrice: string = ''
  contractERC721Token: string = ''
  contractBnbBalance: string | void = ''

  numToBuy: string = '0';
  totalPrice: string = '0';
  purchaseString: string = ''
  error: string = ''
  jsonString$!: Observable<Object>;
  unstakedResponse: any;
  stakedResponse: any;

  unstakedNfts = new Map<number, any>();
  stakedNfts = new Map<number, any>();


  constructor(private web3: Web3Service, private http: HttpClient,) { }

  async ngOnInit(): Promise<any> {
    this.getContent()

  }

  async getContent() {
    try {
      this.isLoading = true;
      this.contractAddress = nftContract._address
      this.contractName = await nftContract.methods.name().call()
      this.contractSymbol = await nftContract.methods.symbol().call()


      // this.contractTotalSupply = await bscContract.methods.maxSupply().call()
      // this.contractPrice = Web3.utils.fromWei(await bscContract.methods.cost().call(), 'ether')
      // this.contractOwner = await bscContract.methods.owner().call()
      // this.contractERC721Token = await bscContract.methods.erc721Token().call()
      this.isLoading = false;
      this.userAddress = await this.web3.getAccounts()
      this.userAddress = Web3.utils.toChecksumAddress(this.userAddress[0])
      this.contractOwner = await nftContract.methods.owner().call()
      this.contractPrice = await nftContract.methods.cost().call()
      this.userNFTs = await nftContract.methods.walletOfOwner(this.userAddress).call()

      this.userNFTs.forEach(async (value) => {
        let tokenURI = await nftContract.methods.tokenURI(value).call()
        this.http.get<string>(tokenURI).subscribe(data => {
          this.unstakedResponse = JSON.parse(JSON.stringify(data));
          this.unstakedResponse.id = value
          this.unstakedResponse.image = "https://ipfs.io/ipfs/QmWrWaK2st7cEBEBjXcDRSPrZkTLsmFcHvNdggyTWACW75/" + value + ".png"
          this.unstakedNfts.set(value, this.unstakedResponse)

        });

      });
      this.userStakedNFTs = await bscContract.methods.getUsersStakedNfts(this.userAddress).call()


      this.userStakedNFTs.forEach(async (id) => {
        let tokenURI = await nftContract.methods.tokenURI(id).call()
        let stakedNftReward = await bscContract.methods.potentialStakedNftReward(this.userAddress, id).call()

        this.http.get<string>(tokenURI).subscribe(data => {

          this.stakedResponse = JSON.parse(JSON.stringify(data));
          this.stakedResponse.id = id
          this.stakedResponse.image = "https://ipfs.io/ipfs/QmWrWaK2st7cEBEBjXcDRSPrZkTLsmFcHvNdggyTWACW75/" + id + ".png"
          this.stakedResponse.potentialReward = stakedNftReward
          this.stakedNfts.set(id, this.stakedResponse)



          // console.log(id + " + " + this.stakedResponse.id)
          //this.stakedNfts.set(id, this.stakedResponse)
        });

      });


    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }


  async mint() {
    try {
      this.isLoading = true;
      this.contractAddress = nftContract._address



      if (this.contractOwner == this.userAddress) {
        this.contractName = await nftContract.methods.mint(1).send({
          from: this.userAddress
        })
      } else {
        this.contractName = await nftContract.methods.mint(1).send({
          from: this.userAddress,
          value: this.contractPrice
        })
      }

      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

  async stake(id: any) {
    try {
      this.isLoading = true;
      await bscContract.methods.stakeNft(id).send({
        from: this.userAddress
      })
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

  async unstake(id: any) {
    try {
      this.isLoading = true;
      await bscContract.methods.removeStakedNft(id).send({
        from: this.userAddress
      })
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

}
