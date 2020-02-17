pragma solidity ^0.5.6;
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";

contract NFTMock is ERC721Metadata {

    // =================================================================================================================
    //                                         NFT Mock
    // =================================================================================================================

    // Mint 10 tokens to `owner`
    constructor(address owner) public ERC721Metadata ("Mock NFT", "MOCK") {
        for (uint i = 0; i < 10; i++) {
            super._mint(owner, i);
            super._setTokenURI(i, "https://api.myjson.com/bins/1dhwd6");
        }
    }

}