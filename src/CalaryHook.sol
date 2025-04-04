// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {BaseHook, IPoolManager, Hooks, PoolKey} from "@openzeppelin/uniswap-hooks/src/base/BaseHook.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@openzeppelin/uniswap-hooks/lib/v4-core/src/types/BeforeSwapDelta.sol";
import {IRegistry} from "./interfaces/IRegistry.sol";
import {BalanceDelta, BalanceDeltaLibrary} from "@openzeppelin/uniswap-hooks/lib/v4-core/src/types/BalanceDelta.sol";
import {IRegistry} from "./interfaces/IRegistry.sol";
import {ICalary} from "./interfaces/ICalary.sol";

contract CalaryHook is BaseHook {
    using BalanceDeltaLibrary for BalanceDelta;

    address registry;
    ICalary calaryToken;

    error CalaryHook__NotVerified();

    constructor(
        IPoolManager _poolManager,
        address _registry,
        address _calaryToken
    ) BaseHook(_poolManager) {
        registry = _registry;
        calaryToken = ICalary(_calaryToken);
    }

    function getHookPermissions()
        public
        pure
        override
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: false,
                afterInitialize: false,
                beforeAddLiquidity: false,
                afterAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: true, // Enable the beforeSwap hook
                afterSwap: true, // Enable the afterSwap hook
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: false,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }

    function beforeSwap(
        address sender,
        PoolKey calldata /*key*/,
        IPoolManager.SwapParams calldata /*params*/,
        bytes calldata /*hookData*/
    )
        external
        view
        override
        onlyPoolManager
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        if (IRegistry(registry).checkValidity(sender) == false) {
            revert CalaryHook__NotVerified();
        }
        return (
            BaseHook.beforeSwap.selector,
            BeforeSwapDeltaLibrary.ZERO_DELTA,
            0
        );
    }

    function afterSwap(
        address sender,
        PoolKey calldata /*key*/,
        IPoolManager.SwapParams calldata params,
        BalanceDelta /*delta*/,
        bytes calldata /*hookData*/
    ) external override onlyPoolManager returns (bytes4, int128) {
        if (IRegistry(registry).checkRewardStatus(sender)) {
            // mint and switch the reward status
            // So that bad users cannot swap to mint multiple times
            int256 amount = params.amountSpecified;
            calaryToken.mint(sender, uint256(amount));
            IRegistry(registry).switchRewardStatus(sender);
        }

        return (BaseHook.afterSwap.selector, 0);
    }
}
