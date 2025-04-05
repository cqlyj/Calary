// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockPOL is ERC20 {
    constructor() ERC20("Mock POL", "POL") {
        _mint(msg.sender, 1000000 * 10 ** 18); // Mint 1 million POL to the deployer
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18; // POL has 18 decimals
    }
}
