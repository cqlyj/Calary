// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ICustomPayrollLogic} from "src/interfaces/ICustomPayrollLogic.sol";

contract PerformanceBasedPayroll is ICustomPayrollLogic {
    struct EmployeeSalary {
        uint256 baseSalary; // Fixed salary per month
        uint256 lastPaymentDate;
    }

    struct Bonus {
        uint256 amount;
        uint256 expirationDate;
    }

    address public boss;
    uint256 public constant PAYMENT_INTERVAL = 30 days;

    mapping(address => EmployeeSalary) private s_salaries;
    mapping(address => Bonus) private s_bonuses;

    event BonusAssigned(
        address indexed employee,
        uint256 amount,
        uint256 expirationDate
    );

    modifier onlyBoss() {
        require(msg.sender == boss, "Not authorized");
        _;
    }

    constructor(address _boss) {
        boss = _boss;
    }

    function setEmployeeSalary(
        address employee,
        uint256 baseSalary
    ) external onlyBoss {
        s_salaries[employee] = EmployeeSalary(baseSalary, block.timestamp);
    }

    function assignBonus(
        address employee,
        uint256 amount,
        uint256 duration
    ) external onlyBoss {
        s_bonuses[employee] = Bonus(amount, block.timestamp + duration);
        emit BonusAssigned(employee, amount, block.timestamp + duration);
    }

    function markPayrollPaid(address employee) external onlyBoss {
        s_salaries[employee].lastPaymentDate = block.timestamp;
    }

    /*//////////////////////////////////////////////////////////////
                           REQUIRED FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function isPayrollDue(
        address /*employee*/
    ) external pure override returns (bool) {
        return true; // Placeholder for actual logic
    }

    function getPayrollAmount(
        address /*employee*/
    ) external pure override returns (uint256) {
        // EmployeeSalary memory salary = s_salaries[employee];
        // Bonus memory bonus = s_bonuses[employee];

        // uint256 totalSalary = salary.baseSalary;

        // // If bonus is still valid, add it
        // if (block.timestamp <= bonus.expirationDate) {
        //     totalSalary += bonus.amount;
        // }

        return 1e6; // Just gonna simplify for now
    }
}
