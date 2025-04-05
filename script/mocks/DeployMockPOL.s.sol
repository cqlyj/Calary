// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {MockPOL} from "test/mocks/MockPOL.sol";

contract DeployMockPOL is Script {
    function run() external {
        vm.startBroadcast();
        MockPOL mockPOL = new MockPOL();
        console.log("Mock POL deployed at:", address(mockPOL));
        vm.stopBroadcast();
    }
}
