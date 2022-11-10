// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Lime is ERC20,Ownable {
    address minter;
    constructor() ERC20("Lime Token", "Lime") {
        
    }

    function mintLime(address to, uint256 amount) public {
        require(msg.sender == minter,"Unauthorized Minter");  
        _mint(to, amount);
        
    }

    function burnLime(address from, uint256 amount) public {
        require(msg.sender == minter,"Unauthorized Minter");  
        _burn(from, amount);
        
    }

function setMinter(address _minter) external onlyOwner{
    minter = _minter;
  }
}