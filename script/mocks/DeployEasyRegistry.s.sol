// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {EasyRegistry} from "test/mocks/EasyRegistry.sol";

contract DeployEasyRegistry is Script {
    function run() external {
        vm.startBroadcast();
        EasyRegistry easyRegistry = new EasyRegistry();
        console.log("EasyRegistry deployed at:", address(easyRegistry));
        vm.stopBroadcast();
    }
}
