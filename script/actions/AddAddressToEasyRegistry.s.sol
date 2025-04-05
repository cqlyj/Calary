// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {EasyRegistry} from "test/mocks/EasyRegistry.sol";
import {Vm} from "forge-std/Vm.sol";

contract AddAddressToEasyRegistry is Script {
    function run() external {
        address mostRecentlyDeployed = Vm(address(vm)).getDeployment(
            "EasyRegistry",
            uint64(block.chainid)
        );

        EasyRegistry easyRegistry = EasyRegistry(mostRecentlyDeployed);

        vm.broadcast();
        easyRegistry.addAddress(
            0xFB6a372F2F51a002b390D18693075157A459641F,
            block.timestamp + 365 days
        );

        console.log(
            "Added address to EasyRegistry: 0xFB6a372F2F51a002b390D18693075157A459641F"
        );
    }
}
