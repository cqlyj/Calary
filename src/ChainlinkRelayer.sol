// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ILogAutomation, Log} from "./interfaces/ILogAutomation.sol";
import {IMailbox} from "@hyperlane/contracts/interfaces/IMailbox.sol";
import {TypeCasts} from "@hyperlane/contracts/libs/TypeCasts.sol";

contract ChainlinkRelayer is ILogAutomation {
    // From Celo to Polygon
    IMailbox public mailbox =
        IMailbox(payable(0x50da3B3907A08a24fe4999F4Dcf337E8dC7954bb));
    uint32 public destination = 137; // Polygon
    address public recipient = 0x8371CA3C7aCB1002f2f940A3F30635623caa7590; // The address of the recipient on Polygon

    function checkLog(
        Log calldata log,
        bytes memory
    ) external pure returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = true;
        address verifiedAddress = bytes32ToAddress(log.topics[1]);
        uint256 expiryTimeStamp = uint256(log.topics[2]);
        performData = abi.encodePacked(verifiedAddress, expiryTimeStamp);
    }

    function performUpkeep(
        bytes calldata performData
    ) external payable override {
        uint256 fee = mailbox.quoteDispatch(
            destination,
            TypeCasts.addressToBytes32(recipient),
            performData
        );
        mailbox.dispatch{value: fee}(
            destination,
            TypeCasts.addressToBytes32(recipient),
            performData
        );
    }

    function bytes32ToAddress(bytes32 _address) public pure returns (address) {
        return address(uint160(uint256(_address)));
    }

    function getFee(bytes memory body) external view returns (uint256) {
        return
            mailbox.quoteDispatch(
                destination,
                TypeCasts.addressToBytes32(recipient),
                body
            );
    }
}
