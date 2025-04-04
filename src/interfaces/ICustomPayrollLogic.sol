// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface ICustomPayrollLogic {
    function isPayrollDue(address employee) external view returns (bool);

    function getPayrollAmount(address employee) external view returns (uint256);
}
