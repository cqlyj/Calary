// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import {Script, console} from "forge-std/Script.sol";
import {Calary} from "src/Calary.sol";

contract DeployCalary is Script {
    function run() external {
        vm.startBroadcast();
        address calary = address(new Calary());
        console.log("Calary deployed at:", calary);
        vm.stopBroadcast();
    }
}
