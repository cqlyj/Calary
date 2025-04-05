// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// This is just for demonstration purposes.
/// For production, please use the Registry contract
/// This one anyone can add address to it.
contract EasyRegistry {
    struct VerifiedUser {
        address walletAddress;
        uint256 deadline;
        bool rewarded;
    }

    // Mapping to store the registered verified addresses
    mapping(address => VerifiedUser) public verifiedAddresses;

    /// This function replace the Hyperlane handle function so it's faster and easier to use
    function addAddress(address walletAddress, uint256 deadline) external {
        verifiedAddresses[walletAddress] = VerifiedUser(
            walletAddress,
            deadline,
            false
        );
    }

    function checkValidity(address walletAddress) external view returns (bool) {
        VerifiedUser memory user = verifiedAddresses[walletAddress];
        return
            user.walletAddress == walletAddress &&
            user.deadline > block.timestamp;
    }

    function switchRewardStatus(address walletAddress) external {
        VerifiedUser storage user = verifiedAddresses[walletAddress];
        user.rewarded = !user.rewarded;
    }

    function checkRewardStatus(
        address walletAddress
    ) external view returns (bool) {
        return verifiedAddresses[walletAddress].rewarded;
    }
}
