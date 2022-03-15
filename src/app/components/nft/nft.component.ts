import { Component, OnInit } from '@angular/core';
import nftContract from "src/app/services/nft.service"
import Web3 from 'web3';
import { Web3Service } from 'src/app/services/Web3/web3.service';
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import { firstValueFrom } from 'rxjs';

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
  contractTotalSupply: string = ''
  contractPrice: string = ''
  contractERC721Token: string = ''
  contractBnbBalance: string | void = ''

  numToBuy: string = '0';
  totalPrice: string = '0';
  purchaseString: string = ''
  error: string = ''
  jsonString$!: Observable<Object>;
  response: any;
  nftMapping = new Map<number, any>();


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
        //console.log(value);
        let tokenURI = await nftContract.methods.tokenURI(value).call()
        // console.log(tokenURI)
        this.http.get<string>(tokenURI).subscribe(data => {
          this.response = JSON.parse(JSON.stringify(data));
          console.log(this.response.image)
          this.response.image = "https://ipfs.io/ipfs/QmWrWaK2st7cEBEBjXcDRSPrZkTLsmFcHvNdggyTWACW75/" + value + ".png"
          this.nftMapping.set(value, this.response)

        });

      });
      console.log(this.nftMapping)


      // this.tokensOwned = await bscContract.methods.balanceOf(this.userAddress).call()
      // this.tokensStaked = await bscContract.methods.stakeOf(this.userAddress).call()
      this.contractBnbBalance = Web3.utils.fromWei(await web3.eth.getBalance(this.contractAddress), 'ether')

    } catch (e) {
      console.log(e)
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



    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

}
