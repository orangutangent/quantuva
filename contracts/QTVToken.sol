// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Quantuva is ERC20, Ownable {
    uint256 public immutable MAX_SUPPLY; 
    uint256 public initialMintAmount = 100000 * 10 ** 18; 

    constructor(address[] memory initialAddresses, uint256 _maxSupply) ERC20("Quantuva", "QTV") Ownable(msg.sender) {
        MAX_SUPPLY = _maxSupply;
        uint256 totalAddresses = initialAddresses.length;
        require(totalAddresses > 0, "No addresses provided");
        for (uint256 i = 0; i < totalAddresses; i++) {
            _mint(initialAddresses[i], initialMintAmount);
        }
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Minting exceeds max supply");
        _mint(to, amount);
    }
}
