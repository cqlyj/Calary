// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {CVLayer} from "src/CVLayer.sol";

contract DeployCVLayer is Script {
    CVLayer public cvLayer;

    address _identityVerificationHub =
        0x77117D60eaB7C044e785D68edB6C7E0e134970Ea;

    uint256 _scope =
        6950199112628375156259974138222458675116284322979895098302408224969310154438;
    uint256 _attestationId = 1; // 1 for passports
    bool _olderThanEnabled = true;
    uint256 _olderThan = 18;
    bool _forbiddenCountriesEnabled = true;

    function run() external {
        uint256[4] memory _forbiddenCountriesListPacked = [
            uint256(82816906711625),
            0,
            0,
            0
        ];
        bool[3] memory _ofacEnabled = [false, false, false]; // We are not using OFAC check

        vm.startBroadcast();

        cvLayer = new CVLayer(
            _identityVerificationHub,
            _scope,
            _attestationId,
            _olderThanEnabled,
            _olderThan,
            _forbiddenCountriesEnabled,
            _forbiddenCountriesListPacked,
            _ofacEnabled
        );
        vm.stopBroadcast();
    }
}
