// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Calary is ERC20, Ownable {
    address calaryHook;

    error Calary__OnlyCalaryHook();

    modifier onlyCalaryHook() {
        if (msg.sender != calaryHook) {
            revert Calary__OnlyCalaryHook();
        }
        _;
    }

    constructor() ERC20("Calary", "Cal") Ownable(msg.sender) {}

    function setCalaryHook(address _calaryHook) external onlyOwner {
        calaryHook = _calaryHook;
    }

    function mint(address to, uint256 amount) external onlyCalaryHook {
        _mint(to, amount);
    }
}
