// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

interface IRegistry {
    function checkValidity(address) external view returns (bool);

    function switchRewardStatus(address) external;

    function checkRewardStatus(address) external view returns (bool);
}
