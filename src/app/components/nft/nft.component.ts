import { Component, OnInit } from '@angular/core';
import nftContract from "src/app/services/Solidity/nft.service"
import Web3 from 'web3';
import { Web3Service } from 'src/app/services/Web3/web3.service';
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import bscContract from "src/app/services/Solidity/contract.service"

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
  contractBnbBalance: string = '0'
  contractUtilityBalance: string = '0'
  nftsOwned: string = '0'

  numToBuy: string = '0';
  numToBuyWithToken: string = '0';

  totalPrice: string = '0';
  totalPriceWithToken: string = '0';

  purchaseString: string = ''
  error: string = ''
  jsonString$!: Observable<Object>;
  unstakedResponse: any;
  stakedResponse: any;

  unstakedNfts = new Map<number, any>();
  stakedNfts = new Map<number, any>();
  contractPriceInUtilityToken: string = ''
  erc20ContractSymbol: string = ''
  isRevealed: boolean = false
  isPaused: boolean = false
  setERC20Token: string = ''
  setERC20TokenBool: boolean = false;
  isERC20ApprovedForAll: boolean = false
  erc20ContractAddress: string = ''
  updateBnbPrice: string = '0'
  updateUtilityPrice: string = '0'
  withdrawalBNB: string = '0'
  withdrawalUtilityToken: string = '0'
  constructor(private web3: Web3Service, private http: HttpClient,) { }

  async ngOnInit(): Promise<any> {
    this.getContent()

  }

  async getContent() {
    this.error = ''

    try {
      this.isLoading = true;   
      this.contractAddress = nftContract._address
      this.userAddress = await this.web3.getAccounts()
      this.userAddress = Web3.utils.toChecksumAddress(this.userAddress[0])
      this.tokensOwned = await bscContract.methods.balanceOf(this.userAddress).call()

      this.contractName = await nftContract.methods.name().call()
      this.contractSymbol = await nftContract.methods.symbol().call()
      this.erc20ContractSymbol = await bscContract.methods.symbol().call()
      this.erc20ContractAddress = await nftContract.methods.erc20Token().call()
      this.isPaused = await nftContract.methods.paused().call()
      this.contractOwner = await nftContract.methods.owner().call()
      this.contractUtilityBalance = await bscContract.methods.balanceOf(this.contractAddress).call()
      this.contractBnbBalance = Web3.utils.fromWei(await web3.eth.getBalance(this.contractAddress), 'ether')

      if (!this.isPaused) {
        this.isRevealed = await nftContract.methods.revealed().call()

        this.contractPrice = Web3.utils.fromWei(await nftContract.methods.cost().call(), "ether")

        this.contractPriceInUtilityToken = await nftContract.methods.costInUtilityToken().call()


        this.nftsOwned = await nftContract.methods.balanceOf(this.userAddress).call()
        console.log(this.nftsOwned)
        for (var i = 0; i < Number(this.nftsOwned); i++) {
          console.log("i = " + i)
          console.log(await nftContract.methods.tokenOfOwnerByIndex(this.userAddress, i).call())

          this.userNFTs.push(await nftContract.methods.tokenOfOwnerByIndex(this.userAddress, i).call())
        }
        console.log(this.userNFTs)
        let tokenURI = '';
        this.userNFTs.forEach(async (value) => {
          if (!this.isRevealed) {
            tokenURI = await nftContract.methods.notRevealedUri().call()
          } else {
            console.log("value = " + value)
            tokenURI = await nftContract.methods.tokenURI(value).call()
            console.log("tokenURI = " + tokenURI)


          }

          this.http.get<string>(tokenURI).subscribe((data: any) => {
            this.unstakedResponse = JSON.parse(JSON.stringify(data));
            this.unstakedResponse.id = value
            if (this.isRevealed) {

              this.unstakedResponse.image = "https://ipfs.io/ipfs/QmWrWaK2st7cEBEBjXcDRSPrZkTLsmFcHvNdggyTWACW75/" + value + ".png"
            }
            else {
              this.unstakedResponse.image = "https://ipfs.io/ipfs/QmPmQ5UvdGxXAWtg7JJm9iePbkE4yHQrpjVfa2BQRqD8Ng?filename=example.gif"

            }
            this.unstakedNfts.set(value, this.unstakedResponse)

          });

        });
        this.userStakedNFTs = await bscContract.methods.getUsersStakedNfts(this.userAddress).call()


        this.userStakedNFTs.forEach(async (id) => {
          if (!this.isRevealed) {
            tokenURI = await nftContract.methods.notRevealedUri().call()
          } else {
            tokenURI = await nftContract.methods.tokenURI(id).call()

          }

          this.http.get<string>(tokenURI).subscribe(async (data: any) => {
            let stakedNftReward = await bscContract.methods.potentialStakedNftReward(this.userAddress, id).call()

            this.stakedResponse = JSON.parse(JSON.stringify(data));
            this.stakedResponse.id = id
            this.stakedResponse.potentialReward = stakedNftReward

            if (this.isRevealed) {

              this.stakedResponse.image = "https://ipfs.io/ipfs/QmWrWaK2st7cEBEBjXcDRSPrZkTLsmFcHvNdggyTWACW75/" + id + ".png"
            }
            else {
              this.stakedResponse.image = "https://ipfs.io/ipfs/QmPmQ5UvdGxXAWtg7JJm9iePbkE4yHQrpjVfa2BQRqD8Ng?filename=example.gif"

            }

            this.stakedNfts.set(id, this.stakedResponse)
          });

        });
      }
      this.isLoading = false;



    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }


  async mint() {
    this.error = ''

    try {
      this.isLoading = true;
      this.contractAddress = nftContract._address



      if (this.contractOwner == this.userAddress) {
        this.contractName = await nftContract.methods.mint(this.numToBuy).send({
          from: this.userAddress
        })
      } else {
        this.contractName = await nftContract.methods.mint(this.numToBuy).send({
          from: this.userAddress,
          value: web3.utils.toWei(this.totalPrice, "ether")
        })
      }

      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

  async setUpdateUtilPrice() {
    this.error = ''

    try {
      this.isLoading = true;

      await nftContract.methods.setCostInUtilityToken(this.updateUtilityPrice).send({
        from: this.userAddress

      })
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

  async setUpdateBnbPrice() {
    this.error = ''

    try {
      this.isLoading = true;

      await nftContract.methods.setCost(web3.utils.toWei(this.updateBnbPrice, 'ether')).send({
        from: this.userAddress

      })
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }



  async mintWithUtilityToken() {
    this.error = ''

    try {
      this.isLoading = true;



      if (this.contractOwner == this.userAddress) {
        await nftContract.methods.mintWithUtilityToken(this.numToBuyWithToken).send({
          from: this.userAddress
        })
      } else {
        await bscContract.methods.approve(nftContract._address, this.totalPriceWithToken).send({
          from: this.userAddress
        })
        await nftContract.methods.mintWithUtilityToken(this.numToBuyWithToken).send({
          from: this.userAddress
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
    this.error = ''

    try {
      this.isLoading = true;
      let isApprovedForAll = await nftContract.methods.isApprovedForAll(this.userAddress, this.erc20ContractAddress).call()
      if (!isApprovedForAll) {
        await nftContract.methods.setApprovalForAll(this.erc20ContractAddress, true).send({
          from: this.userAddress
        })
      }
      await bscContract.methods.stakeNft(id).send({
        from: this.userAddress
      })
      this.unstakedNfts = new Map<number, any>();
      this.stakedNfts = new Map<number, any>();
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

  async unstake(id: any) {
    this.error = ''

    try {
      this.isLoading = true;
      await bscContract.methods.removeStakedNft(id).send({
        from: this.userAddress
      })
      let userStakedNFTs = await bscContract.methods.getUsersStakedNfts(this.userAddress).call()
      if (userStakedNFTs.length! > 0) {
        await nftContract.methods.setApprovalForAll(this.erc20ContractAddress, false).send({
          from: this.userAddress
        })
      }
      this.unstakedNfts = new Map<number, any>();
      this.stakedNfts = new Map<number, any>();
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }


  async collectStakedNftReward(id: any) {
    this.error = ''

    try {
      this.isLoading = true;
      await bscContract.methods.collectStakedNftReward(this.userAddress, id).send({
        from: this.userAddress
      })
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }
  async collectAllStakedNftReward() {
    this.error = ''

    try {
      this.isLoading = true;
      await bscContract.methods.collectAllStakedNftReward(this.userAddress).send({
        from: this.userAddress
      })
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }


  setMintAmount(e: Event) { // without type info
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

  setupdateBnbPrice(e: Event) { // without type info
    this.updateBnbPrice = String(e);

    if (isNaN(Number(this.updateBnbPrice))) {
      this.updateBnbPrice = '0';
    }


  }

  setupdateUtilityPrice(e: Event) { // without type info
    this.updateUtilityPrice = String(e);

    if (isNaN(Number(this.updateUtilityPrice))) {
      this.updateUtilityPrice = '0';
    }


  }


  setMintAmountWithToken(e: Event) {
    this.numToBuyWithToken = String(e);
    this.totalPriceWithToken = (Number(this.numToBuyWithToken) * Number(this.contractPriceInUtilityToken)).toFixed(0)
    if (Number(this.numToBuyWithToken) >= 100000000000) {
      this.numToBuyWithToken = '0'
      this.totalPriceWithToken = '0'
    }
    if (isNaN(Number(this.totalPriceWithToken))) {
      this.numToBuyWithToken = '0';
      this.totalPriceWithToken = '0'
    }


  }

  async setPaused(b: boolean) {
    this.error = ''

    try {
      this.isLoading = true;
      await nftContract.methods.pause(b).send({
        from: this.userAddress
      })
      this.unstakedNfts = new Map<number, any>();
      this.stakedNfts = new Map<number, any>();
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }

  async setRevealed(b: boolean) {
    this.error = ''

    try {
      this.isLoading = true;
      await nftContract.methods.reveal(b).send({
        from: this.userAddress
      })
      this.unstakedNfts = new Map<number, any>();
      this.stakedNfts = new Map<number, any>();
      this.isLoading = false
      this.getContent()
    } catch (e) {
      this.error = e.message
      this.isLoading = false;

    }
  }
  async setErc20address() {
    try {
      this.isLoading = true;
      await nftContract.methods.setErc20address(this.setERC20Token).send({
        from: this.userAddress
      })
      this.getContent()
      this.isLoading = false;
    } catch (e) {
      this.error = e.message
      this.isLoading = false;
    }
  }
  erc20Token(e: Event) {
    this.setERC20Token = ''

    if (e == null || String(e) == '' || String(e) == '0') {
      this.setERC20Token = ''
    } else {
      this.setERC20Token = String(e)
    }
  }

  setWithdrawalUtilityToken(e: Event) { // without type info
    this.withdrawalUtilityToken = String(e);

    if (isNaN(Number(this.withdrawalUtilityToken))) {
      this.withdrawalUtilityToken = '0';
    }


  }
  setWithdrawalBNB(e: Event) { // without type info
    this.withdrawalBNB = String(e);

    if (isNaN(Number(this.withdrawalBNB))) {
      this.withdrawalBNB = '0';
    }


  }



  async getWithdrawalBNB() {
    try {
      this.isLoading = true;
      await nftContract.methods.withdraw(Web3.utils.toWei(this.withdrawalBNB, "ether")
      ).send({
        from: this.userAddress
      })
      this.getContent()
      this.isLoading = false;
    } catch (e) {
      this.error = e.message
      this.isLoading = false;
    }
  }

  async getWithdrawalUtilityToken() {
    try {
      this.isLoading = true;
      await nftContract.methods.withdrawUtility(this.withdrawalUtilityToken).send({
        from: this.userAddress
      })
      this.getContent()
      this.isLoading = false;
    } catch (e) {
      this.error = e.message
      this.isLoading = false;
    }
  }




}
