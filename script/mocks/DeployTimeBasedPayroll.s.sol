// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {TimeBasedPayroll} from "src/TimeBasedPayroll.sol";

contract DeployTimeBasedPayroll is Script {
    address owner = 0xFB6a372F2F51a002b390D18693075157A459641F; // My burner Account
    address _registry = 0x74aCE009385B13197AC36939CfF24CB3Dbd2521C;

    function run() external {
        address[] memory allowedTokens = new address[](1);
        allowedTokens[0] = 0x81F55140e2D2f277510d5913CEF357bc88dC185a; // Mock POL
        vm.startBroadcast();
        TimeBasedPayroll timeBasedPayroll = new TimeBasedPayroll(
            owner,
            allowedTokens,
            _registry
        );
        console.log("TimeBasedPayroll deployed at:", address(timeBasedPayroll));
        vm.stopBroadcast();
    }
}
