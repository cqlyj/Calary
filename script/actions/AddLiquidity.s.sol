// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IPositionManager} from "v4-periphery/src/interfaces/IPositionManager.sol";
import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {StateLibrary} from "v4-core/src/libraries/StateLibrary.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Vm} from "forge-std/Vm.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";
import {IAllowanceTransfer} from "permit2/src/interfaces/IAllowanceTransfer.sol";
import {BalanceDelta, toBalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {Actions} from "v4-periphery/src/libraries/Actions.sol";
import {SafeCast} from "v4-core/src/libraries/SafeCast.sol";

contract AddLiquidity is Script {
    using CurrencyLibrary for Currency;
    using StateLibrary for IPoolManager;
    using SafeCast for uint256;
    using SafeCast for int256;

    IERC20 constant token0 =
        IERC20(address(0x81F55140e2D2f277510d5913CEF357bc88dC185a)); // Mock POL
    IERC20 constant token1 =
        IERC20(address(0xeffD7ac3073F3e4122e31fF18F9Ae69A4a595dFE)); // Mock USDC
    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
    address hookAddress =
        Vm(address(vm)).getDeployment("CalaryHook", uint64(block.chainid));
    IHooks hookContract = IHooks(address(hookAddress));
    PositionManager constant posm =
        PositionManager(
            payable(address(0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4))
        );
    IAllowanceTransfer constant PERMIT2 =
        IAllowanceTransfer(address(0x000000000022D473030F116dDEE9F6B43aC78BA3));
    IPoolManager constant POOLMANAGER =
        IPoolManager(0xE03A1074c86CFeDd5C142C4F04F1a1536e203543);

    /////////////////////////////////////
    // --- Parameters to Configure --- //
    /////////////////////////////////////

    // --- pool configuration --- //
    // fees paid by swappers that accrue to liquidity providers
    uint24 lpFee = 3000; // 0.30%
    int24 tickSpacing = 60;

    // --- liquidity position configuration --- //
    uint256 public token0Amount = 5280e18;
    uint256 public token1Amount = 1000e6;

    // range of the position
    int24 tickLower = -600; // must be a multiple of tickSpacing
    int24 tickUpper = 600;

    /////////////////////////////////////

    function run() external {
        PoolKey memory pool = PoolKey({
            currency0: currency0,
            currency1: currency1,
            fee: lpFee,
            tickSpacing: tickSpacing,
            hooks: hookContract
        });

        (uint160 sqrtPriceX96, , , ) = POOLMANAGER.getSlot0(pool.toId());

        // Converts token amounts to liquidity units
        uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(tickLower),
            TickMath.getSqrtPriceAtTick(tickUpper),
            token0Amount,
            token1Amount
        );

        // slippage limits
        uint256 amount0Max = token0Amount + 1 wei;
        uint256 amount1Max = token1Amount + 1 wei;

        bytes memory hookData = new bytes(0);

        vm.startBroadcast();
        tokenApprovals();
        vm.stopBroadcast();

        vm.startBroadcast();
        mint(
            posm,
            pool,
            tickLower,
            tickUpper,
            liquidity,
            amount0Max,
            amount1Max,
            msg.sender,
            block.timestamp + 60,
            hookData
        );
        vm.stopBroadcast();
    }

    struct MintData {
        uint256 balance0Before;
        uint256 balance1Before;
        bytes[] params;
    }

    function mint(
        IPositionManager _posm,
        PoolKey memory poolKey,
        int24 _tickLower,
        int24 _tickUpper,
        uint256 liquidity,
        uint256 amount0Max,
        uint256 amount1Max,
        address recipient,
        uint256 deadline,
        bytes memory hookData
    ) internal returns (uint256 tokenId, BalanceDelta delta) {
        (Currency _currency0, Currency _currency1) = (
            poolKey.currency0,
            poolKey.currency1
        );

        MintData memory mintData = MintData({
            balance0Before: _currency0.balanceOf(address(this)),
            balance1Before: _currency1.balanceOf(address(this)),
            params: new bytes[](2)
        });
        mintData.params[0] = abi.encode(
            poolKey,
            _tickLower,
            _tickUpper,
            liquidity,
            amount0Max,
            amount1Max,
            recipient,
            hookData
        );
        mintData.params[1] = abi.encode(currency0, currency1);

        // Mint Liquidity
        tokenId = _posm.nextTokenId();
        uint256 valueToPass = currency0.isAddressZero() ? amount0Max : 0;
        posm.modifyLiquidities{value: valueToPass}(
            abi.encode(
                abi.encodePacked(
                    uint8(Actions.MINT_POSITION),
                    uint8(Actions.SETTLE_PAIR)
                ),
                mintData.params
            ),
            deadline
        );

        delta = toBalanceDelta(
            -(mintData.balance0Before - currency0.balanceOf(address(this)))
                .toInt128(),
            -(mintData.balance1Before - currency1.balanceOf(address(this)))
                .toInt128()
        );
    }

    function tokenApprovals() public {
        if (!currency0.isAddressZero()) {
            token0.approve(address(PERMIT2), type(uint256).max);
            PERMIT2.approve(
                address(token0),
                address(posm),
                type(uint160).max,
                type(uint48).max
            );
        }
        if (!currency1.isAddressZero()) {
            token1.approve(address(PERMIT2), type(uint256).max);
            PERMIT2.approve(
                address(token1),
                address(posm),
                type(uint160).max,
                type(uint48).max
            );
        }
    }
}
