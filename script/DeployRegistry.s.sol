// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Registry} from "src/Registry.sol";

contract DeployRegistry is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the Registry contract
        address registry = address(new Registry());

        console.log("Registry deployed at:", registry);
        console.log("At chain ID:", block.chainid);

        vm.stopBroadcast();
    }
}
