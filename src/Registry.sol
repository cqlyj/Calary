// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

contract Registry {
    struct VerifiedUser {
        address walletAddress;
        uint256 deadline;
        bool rewarded;
    }

    error Registry__NotMailbox();

    event ReceivedMessage(
        uint32 origin,
        bytes32 sender,
        uint256 value,
        string data
    );

    // Mapping to store the registered verified addresses
    mapping(address => VerifiedUser) public verifiedAddresses;
    address mailbox = 0x5d934f4e2f797775e53561bB72aca21ba36B96BB;

    modifier onlyMailbox() {
        if (msg.sender != mailbox) {
            revert Registry__NotMailbox();
        }
        _;
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _data
    ) external payable onlyMailbox {
        emit ReceivedMessage(_origin, _sender, msg.value, string(_data));

        address walletAddress = abi.decode(_data, (address));
        uint256 deadline = block.timestamp + 365 days; // 1 year validity from now

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
