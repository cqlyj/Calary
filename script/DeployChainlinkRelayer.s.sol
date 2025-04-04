// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {ChainlinkRelayer} from "src/ChainlinkRelayer.sol";

contract DeployChainlinkRelayer is Script {
    ChainlinkRelayer public chainlinkRelayer;

    function run() external {
        vm.startBroadcast();

        // Deploy the ChainlinkRelayer contract
        chainlinkRelayer = new ChainlinkRelayer();

        console.log("ChainlinkRelayer deployed at:", address(chainlinkRelayer));
        console.log("At chain ID:", block.chainid);

        vm.stopBroadcast();
    }
}
