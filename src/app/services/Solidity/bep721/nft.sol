// SPDX-License-Identifier: MIT

pragma solidity^0.8.11;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol";

contract NFT is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.001 ether;
  uint256 public costInUtilityToken = 500;
  uint256 public maxSupply = 10000;
  uint256 public maxMintAmount = 5;
  bool public paused = true;
  bool public revealed = false;
  string public notRevealedUri;
  ERC20 public erc20Token;
  bytes32 public whiteListMerkleRoot = 0xde59b7738d662c1c7408753bb673b986582a77fe1d06bc57154ce73876a76229;
  mapping(address => bool) public whiteListClaimed;
  bool whiteListOnly = true;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI,
    string memory _initNotRevealedUri
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    setNotRevealedURI(_initNotRevealedUri);
  }

  

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function setWhiteList(bytes32 _wl) public onlyOwner {
        whiteListMerkleRoot = _wl;
    }

      function whiteListOnly(bool _b) public onlyOwner {
        whiteListOnly = _b;
    }
 

      function setErc20address(address _addy) public onlyOwner {
        erc20Token = ERC20(_addy);
    }

  function mint(uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused,"Contract currently paused.");
    require(!whiteListOnly,"Only whitelist can mint right now.");
    require(_mintAmount > 0, "Mint amount has to be greater than 0.");
    require(_mintAmount <= maxMintAmount,"Cant mint more than maxMintAmount");
    require(supply + _mintAmount <= maxSupply, "Minting that many would go over whats available.");

    if (msg.sender != owner()) {
      require(msg.value >= cost * _mintAmount);
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
    }
  }


  function mintWhiteList(bytes32[] calldata _merkleProof,uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused,"Contract currently paused.");
    require(whiteListOnly,"Whitelist no longer available.");
    require(_mintAmount > 0, "Mint amount has to be greater than 0.");
    require(_mintAmount <= maxMintAmount,"Cant mint more than maxMintAmount");
    require(supply + _mintAmount <= maxSupply, "Minting that many would go over whats available.");
    require(!whiteListClaimed[msg.sender],"Address has already claimed");
        if(owner()!=msg.sender){

      bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
      require(MerkleProof.verify(_merkleProof,whiteListMerkleRoot,leaf),"Invalid Proof");
      require(msg.value >= cost * _mintAmount);
      whiteListClaimed[msg.sender]=true;

    
        }
    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
    }
  }



    function mintWithUtilityToken(uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
   require(!paused,"Contract currently paused.");
    require(!whiteListOnly,"Only whitelist can mint right now.");
    require(_mintAmount > 0, "Mint amount has to be greater than 0.");
    require(_mintAmount <= maxMintAmount,"Cant mint more than maxMintAmount");
    require(supply + _mintAmount <= maxSupply, "Minting that many would go over whats available.");


    if (msg.sender != owner()) {
      erc20Token.transferFrom(msg.sender,address(this), costInUtilityToken * _mintAmount);
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
    }
  }


    function mintWithUtilityTokenWhiteList(bytes32[] calldata _merkleProof,uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
   require(!paused,"Contract currently paused.");
    require(whiteListOnly,"Whitelist no longer available.");

    require(_mintAmount > 0, "Mint amount has to be greater than 0.");
    require(_mintAmount <= maxMintAmount,"Cant mint more than maxMintAmount");
    require(supply + _mintAmount <= maxSupply, "Minting that many would go over whats available.");
    if(owner()!=msg.sender){
    require(!whiteListClaimed[msg.sender],"Address has already claimed");
    
      bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
      require(MerkleProof.verify(_merkleProof,whiteListMerkleRoot,leaf),"Invalid Proof");
      
      
      erc20Token.transferFrom(msg.sender,address(this), costInUtilityToken * _mintAmount); 
      whiteListClaimed[msg.sender]=true;

        } 

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
   
      }
    }

    function setWhiteListClaimed(address _addy, bool _b) public onlyOwner {
       whiteListClaimed[_addy] = _b;
    }



  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(_tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    
    if(revealed == false) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), baseExtension))
        : "";
  }

  function reveal(bool _b) public onlyOwner {
      revealed = _b;
  }
  
  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }

  function setCostInUtilityToken(uint256 _newCost) public onlyOwner {
    costInUtilityToken = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
    maxMintAmount = _newmaxMintAmount;
  }
  
  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedUri = _notRevealedURI;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
 
  function withdraw(uint256 _amount) public payable onlyOwner {
    
    (bool os, ) = payable(owner()).call{value: _amount}("");
    require(os);
  }

    function withdrawUtility(uint256 _amount) public payable onlyOwner {
    erc20Token.transfer(owner(),_amount);
  }
}
