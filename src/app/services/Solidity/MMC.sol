// SPDX-License-Identifier: MIT
pragma solidity^0.8.11;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";



contract stakingERC721ForERC20Reward is ERC20, ERC20Burnable, Ownable{   
    using SafeMath for uint256;

    ERC721Enumerable public erc721Token;

    uint256 public cost = 0.000001 ether;
    event Bought(uint256 amount);
    uint256 public maxSupply = 2000000;
    uint256 public circulatingSupply = 0;
    uint256 public stakersAmount = 0;
    uint256 public stakedNfts = 0;
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
    mapping(address => uint256[]) internal ownedTokens;
    address[] internal stakeholders;
    address[] internal nftStakeholders;
    mapping(address => uint256) internal stakes;
    mapping(address => mapping(uint256 => uint256))   public nftStakersWithTime;
    mapping(address => uint256[])  private nftStakersWithArray;


    mapping(address => uint256) internal rewards;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) payable {
        _mint(address(this), 1000000);
    }


    
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function setErc721address(address addy) public onlyOwner {
        erc721Token = ERC721Enumerable(addy);
    }


    function faucet() public {
        require(circulatingSupply + 27 <= maxSupply,"Not enough left to mint that amount.");
        _mint(msg.sender, 27);
        circulatingSupply += 27;
        burn(1);
        transfer(address(this),1);
        emit Bought(25);
    }

    function buy(uint quantity) payable public {

        require(quantity > 0, "Quantity needs to be greater than 1");
        require(circulatingSupply + quantity <= maxSupply,"Not enough left to mint that amount.");
        uint256 totalCostEth = quantity * cost;
        if (msg.sender != owner()) {
            require(msg.value >= totalCostEth, "Did not send enough ETH");
            _mint(msg.sender, quantity + 2);
            burn(1);
            transfer(address(this),1);
            emit Bought(quantity);
        }else{
            _mint(msg.sender, quantity);
            circulatingSupply +=quantity;
            emit Bought(quantity);          
        }

    }

    function withdrawEthFromContractToOwner() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }


    function setCost(uint256 newCost) public  onlyOwner {

        cost = newCost;
    }



    function burn(uint256 amount) public virtual  override {
        _burn(_msgSender(), amount);
        maxSupply -= amount;
        circulatingSupply -= amount;
    }

   
   function isStakeholder(address _address)public view returns(bool, uint256){                                
        if(_address == address(this)){
                return (true, balanceOf(address(this)) - stakersAmount);
                }
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            if (_address == stakeholders[s]){
                uint256 stakeOfAddress = stakeOf(stakeholders[s]);
                return (true, stakeOfAddress );
            } 
        }
        return (false, 0);
   }



   function becomeStakeholder() private {
       (bool _isStakeholder, ) = isStakeholder(msg.sender);
       if(!_isStakeholder) stakeholders.push(msg.sender);
   }

   function removeStakeholder() private  {
       (bool _isStakeholder, uint256 s) = isStakeholder(msg.sender);
       if(_isStakeholder){
           stakeholders[s] = stakeholders[stakeholders.length - 1];
           stakeholders.pop();
       }
    }

   function stakeOf(address _stakeholder) public view returns(uint256){
       if(_stakeholder == address(this)){
        return  balanceOf(address(this)) - stakersAmount;
       }
        return stakes[_stakeholder];
    }

   function createStake(uint256 _stake) public {
        require(_stake >=100, "Minimum stake is 100 tokens.");
        burn(1);
        transfer(address(this), _stake + 1);
        if(stakes[msg.sender] == 0) becomeStakeholder();
        stakes[msg.sender] = stakes[msg.sender].add(_stake);
        stakersAmount += _stake;
   }



   function stakeNft(uint256 _tokenID) public  {
        require(nftStakersWithTime[msg.sender][_tokenID] == 0,"This token already staked.");
        erc721Token.transferFrom(msg.sender,address(this),_tokenID);
        nftStakersWithTime[msg.sender][_tokenID] = block.timestamp;
        stakedNfts +=1;
        nftStakersWithArray[msg.sender].push(_tokenID);

   }

   function getUsersStakedNfts(address staker) public view returns( uint256[] memory) {
                return nftStakersWithArray[staker];
   }

    function potentialAllStakedNftReward(address addy) public view returns (uint256){

        uint256[] memory EEtokens = getUsersStakedNfts(addy);
        uint256 intDate = 0;
        uint256 subtracted = 0;
        uint256 TrzTokens = 0;

        for(uint256 i = 0; i < EEtokens.length; i++){
            if(nftStakersWithTime[addy][EEtokens[i]]!= 0){
              intDate = nftStakersWithTime[addy][EEtokens[i]];
              subtracted = block.timestamp - intDate;
              TrzTokens += subtracted / 3600 ;
            }

        }
        return TrzTokens;
    
     }

    function potentialStakedNftReward(address addy,uint256 _tokenID) public view returns (uint256){
        require(nftStakersWithTime[addy][_tokenID]!= 0,"This token not staked.");
        uint256 intDate = nftStakersWithTime[addy][_tokenID];
        uint256 subtracted = block.timestamp - intDate;
        uint256 tokens = subtracted / 3600;
        return tokens;
    
     }

    function collectAllStakedNftReward(address addy) public  {

                 uint256 sumOfNFTRewards =   potentialAllStakedNftReward(addy); 
                 this.transfer(addy, sumOfNFTRewards);

                    uint256[] memory EEtokens = getUsersStakedNfts(addy);
                    for(uint256 i = 0; i < EEtokens.length; i++){
                        nftStakersWithTime[addy][EEtokens[i]]= block.timestamp;
                    }


   }

    function collectStakedNftReward(address addy, uint256 _tokenID ) public {


        require(nftStakersWithTime[addy][_tokenID]!= 0,"This token not staked.");
        require(potentialStakedNftReward(addy,_tokenID)!= 0,"You dont have enough to claim.");

        uint256 tokens =potentialStakedNftReward(addy,_tokenID);
        this.transfer(addy,tokens);
        nftStakersWithTime[addy][_tokenID]= block.timestamp;  
   }


   function rewardOf(address _stakeholder) public view returns(uint256) {
       return rewards[_stakeholder];
   }

 
   function totalRewards() public view returns(uint256) {
       uint256 _totalRewards = 0;
       for (uint256 s = 0; s < stakeholders.length; s += 1){
           _totalRewards = _totalRewards.add(rewards[stakeholders[s]]);
       }
       return _totalRewards;
   }


   function calculateReward(address _stakeholder) public view returns(uint256) {
       return stakeOf(_stakeholder) / 100;
   }

  
   function distributeRewards() public onlyOwner {
       for (uint256 s = 0; s < stakeholders.length; s += 1){
           address stakeholder = stakeholders[s];
           uint256 reward = calculateReward(stakeholder);
           rewards[stakeholder] = rewards[stakeholder].add(reward);
       }
   }

 
   function withdrawReward() public {
       uint256 reward = rewards[msg.sender];
       rewards[msg.sender] = 0;
       this.transfer(msg.sender, reward -1);
       burn(1); 
   }


 
   function removeStake(uint256 _stake) public {
        if(stakes[msg.sender].sub(_stake) == 0){
            this.transfer(msg.sender, _stake -1);
            stakes[msg.sender] = stakes[msg.sender].sub(_stake);
            stakersAmount -= _stake;   
            removeStakeholder();  
        }else{
            require(stakes[msg.sender].sub(_stake) > 99,"Cant have less than 100 in account");
            this.transfer(msg.sender, _stake -1);
            stakes[msg.sender] = stakes[msg.sender].sub(_stake);
            stakersAmount -= _stake;
        }
    }




   function removeStakedNft(uint256 _stakedNFT) public {
           require(nftStakersWithTime[msg.sender][_stakedNFT] !=0,"Cant Unstake something your not staking.");
            erc721Token.transferFrom(address(this),msg.sender,_stakedNFT);
            nftStakersWithTime[msg.sender][_stakedNFT] = 0; 
            stakedNfts-=1;

            uint256[] storage tempArray =  nftStakersWithArray[msg.sender];
        for (uint256 i = 0; i < tempArray.length; i++){
            if(tempArray[i]== _stakedNFT){

              if (i >= tempArray.length) return;

                    for (uint j = i; j<tempArray.length-1; j++){
                        tempArray[j] = tempArray[j+1];
                    }
                tempArray.pop();
                nftStakersWithArray[msg.sender] = tempArray;
            }
        }  
    }
    

    function nftWalletOfOwner(address _owner)  public view returns (uint256[] memory) {
        uint256 tokenCount = erc721Token.balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = erc721Token.tokenOfOwnerByIndex(_owner, i);
        }

        return tokensId;
    }


    function tokenOfOwnerByIndex(address owner, uint256 index) private view  returns (uint256) {
        require(index < erc721Token.balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return  _ownedTokens[owner][index];
    }

    

}