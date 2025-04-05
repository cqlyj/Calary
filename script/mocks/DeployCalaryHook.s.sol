// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {CalaryHook} from "src/CalaryHook.sol";
import {Hooks} from "@openzeppelin/uniswap-hooks/lib/v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "@openzeppelin/uniswap-hooks/lib/v4-core/src/interfaces/IPoolManager.sol";
import {HookMiner} from "@v4-periphery/src/utils/HookMiner.sol";

contract DeployCalaryHook is Script {
    IPoolManager constant POOLMANAGER =
        IPoolManager(address(0xE03A1074c86CFeDd5C142C4F04F1a1536e203543));
    address constant CREATE2_DEPLOYER =
        0x4e59b44847b379578588920cA78FbF26c0B4956C;
    address constant REGISTRY = 0x74aCE009385B13197AC36939CfF24CB3Dbd2521C;
    address constant CALARY = 0x469fcf5e7503153a146f32eAC5A579b749E27C73;

    error HookAddressMismatch(address actual, address expected);

    function run() public {
        // hook contracts must have specific flags encoded in the address
        uint160 flags = uint160(Hooks.BEFORE_SWAP_FLAG | Hooks.AFTER_SWAP_FLAG);

        // Mine a salt that will produce a hook address with the correct flags
        bytes memory constructorArgs = abi.encode(
            POOLMANAGER,
            REGISTRY,
            CALARY
        );
        (address hookAddress, bytes32 salt) = HookMiner.find(
            CREATE2_DEPLOYER,
            flags,
            type(CalaryHook).creationCode,
            constructorArgs
        );

        // Deploy the hook using CREATE2
        vm.broadcast();
        CalaryHook calaryHook = new CalaryHook{salt: salt}(
            IPoolManager(POOLMANAGER),
            REGISTRY,
            CALARY
        );

        if (address(calaryHook) != hookAddress) {
            revert HookAddressMismatch(address(calaryHook), hookAddress);
        }

        console.log("Hook deployed at", address(calaryHook));
    }
}
