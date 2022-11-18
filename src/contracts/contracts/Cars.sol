// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract Cars is ERC721, VRFConsumerBaseV2, ConfirmedOwner {
    // Zombax
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => TokenMeta) private _tokenMeta;
    mapping(uint256 => address) private _creators;

    string baseURI;

    struct TokenMeta {
        uint256 id;
        uint256 price;
        string name;
        string uri;
        bool isOnSale;
    }

    // VRF
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus) public s_requests;
    VRFCoordinatorV2Interface COORDINATOR;

    uint64 s_subscriptionId;

    uint256[] public requestIds;
    uint256 public lastRequestId;
    bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 callbackGasLimit = 200000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    uint256 public randomNum;
    mapping(uint256 => address) public requestIdToSender;

    constructor()
        ERC721("Zombax Cars", "CAR")
        VRFConsumerBaseV2(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed);
        s_subscriptionId = 2628;
    }

    function randomMint() public returns (uint256 requestId) {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({ randomWords: new uint256[](0), exists: true, fulfilled: false });
        requestIds.push(requestId);
        lastRequestId = requestId;
        requestIdToSender[requestId] = msg.sender;
        emit RequestSent(requestId, numWords);

        return requestId;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);

        //Zombax minter
        randomNum = _randomWords[0];
        // Car Boost Weight Gun Gear Armor Wheel Fuel
        // CBWGGAWF
        // 01010330
        string memory car = "0";
        string memory boost = Strings.toString(randomNum % 2);
        string memory weight = Strings.toString(randomNum % 1);
        string memory gun = Strings.toString(randomNum % 2);
        string memory gear = Strings.toString(randomNum % 1);
        string memory armor = Strings.toString(randomNum % 4);
        string memory wheel = Strings.toString(randomNum % 4);
        string memory fuel = Strings.toString(randomNum % 1);

        string memory tokenUri = string(
            abi.encodePacked(
                "https://vrf.zombax.io/assets/cars/",
                car,
                boost,
                weight,
                gun,
                gear,
                armor,
                wheel,
                fuel,
                ".json"
            )
        );

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        address tokenOwner = requestIdToSender[_requestId];

        _mint(tokenOwner, newItemId);
        _creators[newItemId] = tokenOwner;
        TokenMeta memory meta = TokenMeta(newItemId, 1000000, "Genesis Car", tokenUri, false);
        _setTokenMeta(newItemId, meta);
    }

    function getRequestStatus(uint256 _requestId) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    // Zombax
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public virtual onlyOwner {
        baseURI = _newBaseURI;
    }

    function getAllOnSale() public view virtual returns (TokenMeta[] memory) {
        TokenMeta[] memory tokensOnSale = new TokenMeta[](_tokenIds.current());
        uint256 counter = 0;
        for (uint256 i = 1; i < _tokenIds.current() + 1; i++) {
            if (_tokenMeta[i].isOnSale == true) {
                tokensOnSale[counter] = _tokenMeta[i];
                counter++;
            }
        }
        return tokensOnSale;
    }

    function setTokenSale(
        uint256 _tokenId,
        bool _isOnSale,
        uint256 _price
    ) public {
        require(_exists(_tokenId), "ERC721Metadata: Sale set of nonexistent token");
        require(_price > 0);
        require(ownerOf(_tokenId) == _msgSender());
        _tokenMeta[_tokenId].isOnSale = _isOnSale;
        setTokenPrice(_tokenId, _price);
    }

    function setTokenPrice(uint256 _tokenId, uint256 _price) public {
        require(_exists(_tokenId), "ERC721Metadata: Price set of nonexistent token");
        require(ownerOf(_tokenId) == _msgSender());
        _tokenMeta[_tokenId].price = _price;
    }

    function tokenPrice(uint256 tokenId) public view virtual returns (uint256) {
        require(_exists(tokenId), "ERC721Metadata: Price query for nonexistent token");
        return _tokenMeta[tokenId].price;
    }

    function _setTokenMeta(uint256 _tokenId, TokenMeta memory _meta) private {
        require(_exists(_tokenId));
        require(ownerOf(_tokenId) == _msgSender());
        _tokenMeta[_tokenId] = _meta;
    }

    function updateTokenUri(uint256 _tokenId, string memory _uri) public {
        require(_exists(_tokenId));
        require(ownerOf(_tokenId) == _msgSender());
        _tokenMeta[_tokenId].uri = _uri;
    }

    function tokenMeta(uint256 _tokenId) public view returns (TokenMeta memory) {
        require(_exists(_tokenId));
        return _tokenMeta[_tokenId];
    }

    function purchaseToken(uint256 _tokenId) public payable {
        require(msg.sender != address(0) && msg.sender != ownerOf(_tokenId));
        require(msg.value >= _tokenMeta[_tokenId].price);
        address tokenSeller = ownerOf(_tokenId);
        payable(tokenSeller).transfer(msg.value);
        setApprovalForAll(tokenSeller, true);
        _transfer(tokenSeller, msg.sender, _tokenId);
        _tokenMeta[_tokenId].isOnSale = false;
    }

    function mintCollectable(
        address _owner,
        string memory _tokenURI,
        string memory _name,
        uint256 _price,
        bool _isOnSale
    ) public onlyOwner returns (uint256) {
        require(_price > 0);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_owner, newItemId);
        _creators[newItemId] = msg.sender;
        TokenMeta memory meta = TokenMeta(newItemId, _price, _name, _tokenURI, _isOnSale);
        _setTokenMeta(newItemId, meta);
        return newItemId;
    }

    function getTokensOwnedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensOwned = balanceOf(msg.sender);
        uint256[] memory ownedTokenIds = new uint256[](numberOfTokensOwned);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (ownerOf(tokenId) != msg.sender) continue;
            ownedTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return ownedTokenIds;
    }

    function getTokenCreatorById(uint256 tokenId) public view returns (address) {
        return _creators[tokenId];
    }

    function getTokensCreatedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensCreated = 0;

        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            numberOfTokensCreated += 1;
        }

        uint256[] memory createdTokenIds = new uint256[](numberOfTokensCreated);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            createdTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return createdTokenIds;
    }
}
