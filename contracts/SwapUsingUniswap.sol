// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

pragma abicoder v2;

import '../node_modules/@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '../node_modules/@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';


contract SwapUsingUniswap {

    address private constant SWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;


    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant USDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    

    /// @notice swapExactUsdtForWeth swaps a fixed amount of USDT for a maximum possible amount of WETH
    /// using the USDT/WETH 0.3% pool by calling `exactInputSingle` in the swap router.
    /// @dev The calling address must approve this contract to spend at least `amountIn` worth of its USDT for this function to succeed.
    /// @param amountIn The exact amount of USDT that will be swapped for WETH.
    /// @return amountOut The amount of WETH received.
    function swapExactUsdtForWeth(uint256 amountIn, address _to) external returns (uint256 amountOut) {
        // msg.sender must approve this contract

        // Transfer the specified amount of USDT to this contract.
        TransferHelper.safeTransferFrom(USDT, msg.sender, address(this), amountIn);

        // Approve the router to spend USDT.
        TransferHelper.safeApprove(USDT, SWAP_ROUTER, amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: USDT,
                tokenOut: WETH,
                fee: poolFee,
                recipient: _to,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = ISwapRouter(SWAP_ROUTER).exactInputSingle{value: address(this).balance}(params);
        return amountOut;
    }

 

     receive() external payable {}
    

}