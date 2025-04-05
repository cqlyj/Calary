// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {MockCLPayroll} from "test/mocks/MockCLPayroll.sol";
import {MockUSDC} from "test/mocks/MockUSDC.sol";
import {EasyRegistry} from "test/mocks/EasyRegistry.sol";
import {PerformanceBasedPayroll} from "test/mocks/PerformanceBasedPayroll.sol";

contract CustomLogicPayrollTest is Test {
    // address _registry
    address owner = makeAddr("owner");
    address[] allowedTokens = new address[](0); // simplify for testing
    address registry;
    MockCLPayroll payroll;
    PerformanceBasedPayroll logic;
    MockUSDC usdc;

    function setUp() public {
        vm.startPrank(owner);
        registry = address(new EasyRegistry());
        usdc = new MockUSDC();
        vm.stopPrank();

        vm.startPrank(owner);
        payroll = new MockCLPayroll(
            owner,
            allowedTokens,
            registry,
            address(usdc)
        );
        vm.stopPrank();
    }

    function testCustomLogicPayrollWorksWithCompatibleLogic() public {
        logic = new PerformanceBasedPayroll(owner);
        address employee = makeAddr("employee");

        EasyRegistry(registry).addAddress(employee, type(uint256).max);

        vm.startPrank(owner);
        payroll.addEmployee(1, employee, address(logic));
        usdc.approve(address(payroll), 1e6);
        payroll.depositFunds(1e6);
        vm.stopPrank();

        vm.startPrank(employee);
        // This should not revert
        payroll.claimPayroll(1);
        vm.stopPrank();
    }
}
