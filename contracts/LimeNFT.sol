// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LimeNFT is ERC1155 ,Ownable {
     string public name = "Lime NFT";
     string public symbol ="LIMENFT"; 
     string AGENT_URI="https://bafkreif34yoxcuhcd2ncylch3q3rujqxozbwfanwaqfp5cwq74agwbxrj4.ipfs.nftstorage.link/";
	 string MEMBER_URI="https://bafkreidaifwng7s4eflncwtaermz5oo2lzcsileqdarjgzeplrs4ipzcli.ipfs.nftstorage.link/";
	 address minter;
	 uint8 constant AGENT = 1;
	 uint8 constant MEMBER =2;
     
	 constructor(address _minter)  ERC1155("") {
        minter = _minter;  
         
    }
	
	
 	 
 /**
   * @dev Function allows for the minting of NFTs  
   * @param To mint to address
   * @param id tokenId to mint
   **/
	
	 
	 function mint(address To,uint256 id) public{
	   require(msg.sender == minter,"Unauthorized minter.");
	   require(id == MEMBER || id ==  AGENT, "Invalid token id.");
       _mint( To, id, 1, "");
   
	  
     }

/**
   * @dev Function allows for the burning of NFTs  
   * @param From address to burn from
   * @param id tokenId to mint
   **/
	
	 
	 function burn(address From,uint256 id) public{
	   require(msg.sender == minter,"Unauthorized minter.");
	   require(id == MEMBER || id ==  AGENT, "Invalid token id.");

       _burn( From, id, 1);
   
	  
     }
	 

	 
	 /**
     * @dev Function returns tokenId URI
    * @param tokenId of NFT.
   **/
	
	 function uri(uint256 tokenId) public override view returns (string memory){
	  string memory _uri;
      if(tokenId == AGENT)
         _uri = AGENT_URI;
 
      if(tokenId == MEMBER)
         _uri = MEMBER_URI;

 
      return _uri;
    }

   /**
   * @dev Function sets address that is allowed to mint
    * @param _minter only address allowed to mint NFTs.
   **/
	

    function setMinter(address _minter) external onlyOwner{
    minter = _minter;
  }
  
  
  /**
   * @dev Function sets agent uri 
    * @param _uri for agent NFT.
   **/
	

    function setAgentURI(string calldata _uri) external onlyOwner{
    AGENT_URI = _uri;
  }
  
  
    /**
   * @dev Function sets member uri 
    * @param _uri for member NFT.
   **/
	

    function setMemberURI(string calldata _uri) external onlyOwner{
    MEMBER_URI = _uri;
  }
}