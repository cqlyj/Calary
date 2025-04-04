// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@self/contracts/abstract/SelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@self/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@self/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {CircuitConstants} from "@self/contracts/constants/CircuitConstants.sol";
import {Formatter} from "@self/contracts/libraries/Formatter.sol";
import {CircuitAttributeHandler} from "@self/contracts/libraries/CircuitAttributeHandler.sol";
import {IMailbox} from "@hyperlane/contracts/interfaces/IMailbox.sol";
import {TypeCasts} from "@hyperlane/contracts/libs/TypeCasts.sol";

contract CVLayer is SelfVerificationRoot {
    mapping(uint256 => uint256) internal _nullifiers;

    // From Celo to Polygon
    IMailbox public mailbox =
        IMailbox(payable(0x50da3B3907A08a24fe4999F4Dcf337E8dC7954bb));
    uint32 public destination = 137; // Polygon
    address public recipient = 0xeb6421483320405DD5378518f3F16468af9C6e9b; // The address of the recipient on Polygon

    error RegisteredNullifier();
    error InvalidUserIdentifier();

    event UserIdentifierRegistered(
        uint256 indexed registeredUserIdentifier,
        uint256 indexed nullifier
    );

    constructor(
        address _identityVerificationHub,
        uint256 _scope,
        uint256 _attestationId,
        bool _olderThanEnabled,
        uint256 _olderThan,
        bool _forbiddenCountriesEnabled,
        uint256[4] memory _forbiddenCountriesListPacked,
        bool[3] memory _ofacEnabled
    )
        SelfVerificationRoot(
            _identityVerificationHub, // Address of our Verification Hub, e.g., "0x77117D60eaB7C044e785D68edB6C7E0e134970Ea"
            _scope, // An application-specific identifier for the integrated contract
            _attestationId, // The id specifying the type of document to verify (e.g., 1 for passports)
            _olderThanEnabled, // Flag to enable age verification
            _olderThan, // The minimum age required for verification
            _forbiddenCountriesEnabled, // Flag to enable forbidden countries verification
            _forbiddenCountriesListPacked, // Packed data representing the list of forbidden countries
            _ofacEnabled // Flag to enable OFAC check
        )
    {}

    function verifySelfProof(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    ) public override {
        if (
            _scope !=
            proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]
        ) {
            revert InvalidScope();
        }

        if (
            _attestationId !=
            proof.pubSignals[
                CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX
            ]
        ) {
            revert InvalidAttestationId();
        }

        if (
            _nullifiers[
                proof.pubSignals[
                    CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX
                ]
            ] != 0
        ) {
            revert RegisteredNullifier();
        }

        if (
            proof.pubSignals[
                CircuitConstants.VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX
            ] == 0
        ) {
            revert InvalidUserIdentifier();
        }

        IIdentityVerificationHubV1.VcAndDiscloseVerificationResult
            memory result = _identityVerificationHub.verifyVcAndDisclose(
                IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                    olderThanEnabled: _verificationConfig.olderThanEnabled,
                    olderThan: _verificationConfig.olderThan,
                    forbiddenCountriesEnabled: _verificationConfig
                        .forbiddenCountriesEnabled,
                    forbiddenCountriesListPacked: _verificationConfig
                        .forbiddenCountriesListPacked,
                    ofacEnabled: _verificationConfig.ofacEnabled,
                    vcAndDiscloseProof: proof
                })
            );

        _nullifiers[result.nullifier] = proof.pubSignals[
            CircuitConstants.VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX
        ];

        bytes memory body = abi.encode(address(uint160(result.userIdentifier)));
        uint256 fee = mailbox.quoteDispatch(
            destination,
            TypeCasts.addressToBytes32(recipient),
            body
        );
        mailbox.dispatch{value: fee}(
            destination,
            TypeCasts.addressToBytes32(recipient),
            body
        );

        emit UserIdentifierRegistered(
            proof.pubSignals[
                CircuitConstants.VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX
            ],
            result.nullifier
        );
    }
}
