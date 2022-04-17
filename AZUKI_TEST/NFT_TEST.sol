    // SPDX-License-Identifier: MIT

    pragma solidity^0.8.11;

    import "./ERC721A.sol";
    import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol";
    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

   

    contract NFT is ERC721A {
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.001 ether;
    uint256 public costInUtilityToken = 500;
    uint256 public maxSupply = 10001;
    uint256 public maxMintAmount = 5;
    bool public paused = true;
    bool public revealed = false;
    string public notRevealedUri;
    address public owner = msg.sender;
    bytes32 public whiteListMerkleRoot = 0xde59b7738d662c1c7408753bb673b986582a77fe1d06bc57154ce73876a76229;
    mapping(address => bool) public whiteListClaimed;
    bool whiteListOnly = false;

    ERC20 public erc20Token;

    constructor() ERC721A("test", "testSymbol",maxMintAmount,maxSupply) {
        setBaseURI("https://ipfs.io/ipfs/QmYEExVEGTm1qqb7xEzhY6v7KtgN5r2Wp5BFRynQ3sCf4B/");
        setNotRevealedURI("https://ipfs.io/ipfs/QmShmPVB1PQAH9iqgJVqTsxegwW1ncfnkkUjqtEP8Ut4mP?filename=PreReveal.json");
        setPaused(false);
        setRevealed(true);
        //Will update JSON in future to start at 0
        // _safeMint(msg.sender,1);
        // transferFrom(msg.sender, 0x000000000000000000000000000000000000dEaD, 0);
    
    }


    //modifier checks that the caller of the function is the owner
        modifier onlyOwner() {
            require(msg.sender == owner, 'Not Owner');
            _;
        }
        modifier callerIsUser() {
         require(tx.origin == msg.sender, "The caller is another contract");
            _;
        }


    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setWhiteList(bytes32 _wl) public onlyOwner {
            whiteListMerkleRoot = _wl;
        }

    function setWhiteListOnly(bool _b) public onlyOwner {
            whiteListOnly = _b;
        }
    

    function setErc20address(address _addy) public onlyOwner {
            erc20Token = ERC20(_addy);
        }

    function transferOwnership(address _addy) public onlyOwner {
            erc20Token = ERC20(_addy);
        }


    function mint(uint256 _mintAmount) public payable callerIsUser {
        uint256 supply = totalSupply();   
        require(_mintAmount > 0, "Mint amount has to be greater than 0.");
        require(supply + _mintAmount <= maxSupply, "Minting that many would go over whats available.");

        if (msg.sender != owner) {
        require(!paused,"Contract currently paused.");
        require(!whiteListOnly,"Only whitelist can mint right now.");
        require(_mintAmount <= maxMintAmount,"Cant mint more than maxMintAmount");
        require(msg.value >= cost * _mintAmount);
        }
        _safeMint(msg.sender,_mintAmount);

    }


    function mintWhiteList(bytes32[] calldata _merkleProof,uint256 _mintAmount) public payable callerIsUser {
        uint256 supply = totalSupply();

        require(_mintAmount > 0, "Mint amount has to be greater than 0.");
        require(supply + _mintAmount <= maxSupply, "Minting that many would go over whats available.");
    
            if(owner!=msg.sender){
            require(!paused,"Contract currently paused.");
            require(whiteListOnly,"Whitelist no longer available.");   
            require(!whiteListClaimed[msg.sender],"Address has already claimed");
            require(_mintAmount <= maxMintAmount,"Cant mint more than maxMintAmount");

            bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
            require(MerkleProof.verify(_merkleProof,whiteListMerkleRoot,leaf),"Invalid Proof");
            require(msg.value >= cost * _mintAmount);
            whiteListClaimed[msg.sender]=true;

        
            }
        _safeMint(msg.sender,_mintAmount);

    }

    function mintWithUtilityToken(uint256 _mintAmount) public payable callerIsUser {
        require(_mintAmount > 0, "Mint amount has to be greater than 0.");
        require(totalSupply() + _mintAmount <= maxSupply, "Minting that many would go over whats available.");

        if (msg.sender != owner) {
        require(!paused,"Contract currently paused.");
        require(!whiteListOnly,"Only whitelist can mint right now.");
        require(_mintAmount <= maxMintAmount,"Cant mint more than maxMintAmount");    
        erc20Token.transferFrom(msg.sender,address(this), (costInUtilityToken * _mintAmount));
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
        _safeMint(msg.sender, totalSupply() + i);
        }
    }


        function mintWithUtilityTokenWhiteList(bytes32[] calldata _merkleProof,uint256 _mintAmount) public payable callerIsUser {
        uint256 supply = totalSupply();
        require(_mintAmount > 0, "Mint amount has to be greater than 0.");
        require(supply + _mintAmount <= maxSupply, "Minting that many would go over whats available.");
        if(owner!=msg.sender){
        require(_mintAmount <= maxMintAmount,"Cant mint more than maxMintAmount");
        require(!paused,"Contract currently paused.");
        require(whiteListOnly,"Whitelist no longer available.");
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



    // function walletOfOwner(address _owner)
    //     public
    //     view
    //     returns (address[] memory)
    // {
    //     uint256 ownerTokenCount = balanceOf(_owner);
    //     address[] memory tokenIds = new address[](ownerTokenCount);
    //     for (uint256 i; i < ownerTokenCount; i++) {
    //     tokenIds[i] = ownerOf(i);
    //     }
    //     return tokenIds;
    // }

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
            ? string(abi.encodePacked(currentBaseURI, (_tokenId).toString(), baseExtension))
            : "";
    }

    function setRevealed(bool _b) public onlyOwner {
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

    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }
    
    function withdraw(uint256 _amount) public payable onlyOwner {
        
        (bool os, ) = payable(owner).call{value: _amount}("");
        require(os);
    }

        function withdrawUtility(uint256 _amount) public payable onlyOwner {
        erc20Token.transfer(owner,_amount);
    }
    }
