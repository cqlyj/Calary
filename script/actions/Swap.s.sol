// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Vm} from "forge-std/Vm.sol";

contract Swap is Script {
    IERC20 constant token0 =
        IERC20(address(0x81F55140e2D2f277510d5913CEF357bc88dC185a)); // Mock POL
    IERC20 constant token1 =
        IERC20(address(0xeffD7ac3073F3e4122e31fF18F9Ae69A4a595dFE)); // Mock USDC
    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
    address hookAddress =
        Vm(address(vm)).getDeployment("CalaryHook", uint64(block.chainid));
    IHooks hookContract = IHooks(address(hookAddress));

    // slippage tolerance to allow for unlimited price impact
    uint160 public constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
    uint160 public constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

    /////////////////////////////////////
    // --- Parameters to Configure --- //
    /////////////////////////////////////

    // PoolSwapTest Contract address
    PoolSwapTest swapRouter =
        PoolSwapTest(0x9B6b46e2c869aa39918Db7f52f5557FE577B6eEe);

    // --- pool configuration --- //
    // fees paid by swappers that accrue to liquidity providers
    uint24 lpFee = 3000; // 0.30%
    int24 tickSpacing = 60;

    function run() external {
        PoolKey memory pool = PoolKey({
            currency0: currency0,
            currency1: currency1,
            fee: lpFee,
            tickSpacing: tickSpacing,
            hooks: hookContract
        });

        // approve tokens to the swap router
        vm.broadcast();
        token0.approve(address(swapRouter), type(uint256).max);
        vm.broadcast();
        token1.approve(address(swapRouter), type(uint256).max);

        // ------------------------------ //
        //  Swap 1e9 token0 into token1  //
        // ------------------------------ //
        bool zeroForOne = false; // token1 -> token0 => USDC -> POL
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: zeroForOne,
            amountSpecified: 1e9,
            sqrtPriceLimitX96: zeroForOne ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT // unlimited impact
        });

        // in v4, users have the option to receieve native ERC20s or wrapped ERC1155 tokens
        // here, we'll take the ERC20s
        PoolSwapTest.TestSettings memory testSettings = PoolSwapTest
            .TestSettings({takeClaims: false, settleUsingBurn: false});

        bytes memory hookData = abi.encode(msg.sender);
        vm.broadcast();
        swapRouter.swap(pool, params, testSettings, hookData);
    }
}
