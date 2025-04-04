// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRegistry} from "./interfaces/IRegistry.sol";

contract MilestoneBasedPayroll is Ownable {
    struct Employee {
        uint256 employeeId;
        address connectedWallet;
        uint256 salaryAmount;
    }

    struct Preference {
        address[] tokens;
        uint256[] percentages;
    }

    address gasMaster;
    bool milestoneReached = false;

    address[] private s_allowedTokens;
    IERC20 private immutable i_usdc =
        IERC20(0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359); // Polygon USDC with 6 decimals
    mapping(uint256 employeeId => Employee) private s_idToEmployee;
    mapping(uint256 employeeId => Preference) private s_idToPreference;
    mapping(address connectedWallet => uint256 employeeId)
        private s_walletToEmployeeId;
    uint256 private constant PERCENTAGE = 100;
    address registry;

    event EmployeeAdded(
        uint256 indexed employeeId,
        address indexed connectedWallet,
        uint256 salaryAmount
    );

    event PreferencesSet(
        uint256 indexed employeeId,
        address[] tokens,
        uint256[] percentages
    );

    event DepositFunds(uint256 amountOfUsdc);

    event Withdraw(uint256 amountOfUsdc);

    event PayrollClaimed(
        uint256 indexed employeeId,
        address indexed connectedWallet,
        uint256 amount,
        address[] tokens,
        uint256[] percentages
    );

    error MilestoneBasedPayroll__NotGasMaster();
    error Payroll__TransferFailed();
    error Payroll__NotVerifiedEmployee();
    error Payroll__NotAllowedToken();
    error Payroll__InvalidSumOfPercentages();
    error Payroll__InvalidEmployeeId();
    error Payroll__NotAuthorized();
    error Payroll__MismatchedLength();
    error Payroll__InsufficientFunds();
    error Payroll__MilestoneNotReached();

    modifier onlyGasMaster() {
        if (msg.sender != gasMaster) {
            revert MilestoneBasedPayroll__NotGasMaster();
        }
        _;
    }

    modifier onlyMilestoneReached() {
        if (!milestoneReached) {
            revert Payroll__MilestoneNotReached();
        }
        _;
    }

    constructor(
        address owner,
        address[] memory allowedTokens,
        address _registry,
        address _gasMaster
    ) Ownable(owner) {
        s_allowedTokens = allowedTokens;
        registry = _registry;
        gasMaster = _gasMaster;
    }

    /*//////////////////////////////////////////////////////////////
                          GASMASTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function reachMilestone() external onlyGasMaster {
        milestoneReached = true;
    }

    function depositFunds(uint256 amountOfUsdc) external payable onlyOwner {
        bool success = i_usdc.transferFrom(
            msg.sender,
            address(this),
            amountOfUsdc
        );

        if (!success) {
            revert Payroll__TransferFailed();
        }
        i_usdc.approve(address(this), amountOfUsdc);

        emit DepositFunds(amountOfUsdc);
    }

    function addEmployee(
        uint256 employeeId,
        address connectedWallet,
        uint256 salaryAmount
    ) external onlyOwner {
        if (IRegistry(registry).checkValidity(connectedWallet) == false) {
            revert Payroll__NotVerifiedEmployee();
        }
        _validEmployeeId(employeeId);
        s_idToEmployee[employeeId] = Employee(
            employeeId,
            connectedWallet,
            salaryAmount
        );
        s_idToPreference[employeeId] = Preference(
            new address[](0),
            new uint256[](0)
        );
        s_walletToEmployeeId[connectedWallet] = employeeId;

        emit EmployeeAdded(employeeId, connectedWallet, salaryAmount);
    }

    function withdrawFund(uint256 amountOfUsdc) external onlyOwner {
        bool success = i_usdc.transfer(msg.sender, amountOfUsdc);
        if (!success) {
            revert Payroll__TransferFailed();
        }
        emit Withdraw(amountOfUsdc);
    }

    /*//////////////////////////////////////////////////////////////
                           EMPLOYEE FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function setPreferences(
        uint256 employeeId,
        address[] calldata tokens,
        uint256[] calldata percentages
    ) external {
        if (s_idToEmployee[employeeId].connectedWallet != msg.sender) {
            revert Payroll__NotAuthorized();
        }

        if (tokens.length != percentages.length) {
            revert Payroll__MismatchedLength();
        }

        // check the sum of percentages is less than 100
        // here the usdc is not included in the tokens array
        _checkTokens(tokens);
        _checkPercentage(percentages);

        s_idToPreference[employeeId] = Preference(tokens, percentages);

        emit PreferencesSet(employeeId, tokens, percentages);
    }

    function claimPayroll(uint256 employeeId) external onlyMilestoneReached {
        Employee storage employee = s_idToEmployee[employeeId];

        if (employee.connectedWallet != msg.sender) {
            revert Payroll__NotAuthorized();
        }

        uint256 amount = employee.salaryAmount;
        if (i_usdc.balanceOf(address(this)) < amount) {
            revert Payroll__InsufficientFunds();
        }

        IRegistry(registry).switchRewardStatus(msg.sender);

        // transfer the USDC to the employee first
        bool success = i_usdc.transfer(msg.sender, amount);
        if (!success) {
            revert Payroll__TransferFailed();
        }

        emit PayrollClaimed(
            employeeId,
            msg.sender,
            amount,
            s_idToPreference[employeeId].tokens,
            s_idToPreference[employeeId].percentages
        );
    }

    /*//////////////////////////////////////////////////////////////
                            HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _checkTokens(address[] calldata tokens) internal view {
        uint256 length = tokens.length;
        uint256 allowedTokenLength = s_allowedTokens.length;
        for (uint256 i = 0; i < length; i++) {
            bool found = false;
            for (uint256 j = 0; j < allowedTokenLength; j++) {
                if (tokens[i] == s_allowedTokens[j]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                revert Payroll__NotAllowedToken();
            }
        }
    }

    function _checkPercentage(uint256[] calldata percentages) internal pure {
        uint256 length = percentages.length;
        uint256 sum = 0;
        for (uint256 i = 0; i < length; i++) {
            sum += percentages[i];
        }
        if (sum > PERCENTAGE) {
            revert Payroll__InvalidSumOfPercentages();
        }
    }

    function _validEmployeeId(uint256 employeeId) internal view {
        // This is to prevent overwriting an existing employee
        if (s_idToEmployee[employeeId].employeeId != 0) {
            revert Payroll__InvalidEmployeeId();
        }
    }
}
