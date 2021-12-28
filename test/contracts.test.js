
var chai = require('chai');  
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect } = chai;
require('dotenv').config()
const IERC20 = artifacts.require("IERC20");

const { USDT_ADDRESS,  WETH_ADDRESS, USDT_WHALE_ADDRESS } = process.env;
const {assert} = require("chai")

const SwapUsingUniswap = artifacts.require("SwapUsingUniswap");
// const SwapRouter = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

contract("SwapUsingUniswap",  (accounts) => {
    let amount_in = 1000000; // 100M
    let amount_received;
    const TO = accounts[0];

    let tokenInContract, tokenOutContract, swapContract, usdtTokenContract, wethTokenContract;
    let usdt_whale_usdt_balance_before, usdt_whale_usdt_balance_after;
    let acc0_weth_balance_before, acc0_weth_balance_after;


    before(async () => {

        swapContract = await SwapUsingUniswap.deployed();
        
        usdtTokenContract = new web3.eth.Contract(
            IERC20.abi,
            USDT_ADDRESS
        );

        wethTokenContract =  new web3.eth.Contract(
            IERC20.abi,
            WETH_ADDRESS
        );
    
        // Fund contract with some eth
        await web3.eth.sendTransaction({to:swapContract.address, from: accounts[0], value:web3.utils.toWei("1")});

        console.log("swap contract address", swapContract.address);
        console.log("USDT_WHALE_ADDRESS = ", USDT_WHALE_ADDRESS);
        console.log("acc0 = ", accounts[0])

        
    });

    it('should swap exact USDTs for WETH', async() => {

        tokenInContract = usdtTokenContract;

        tokenOutContract = wethTokenContract;

     

        console.log("acc0 USDT balance = ", await usdtTokenContract.methods.balanceOf(TO).call());
        console.log("acc0 WETH baalnce = ", await wethTokenContract.methods.balanceOf(TO).call());
        console.log("acc0 ETH baalnce = ", await web3.eth.getBalance(TO));

        console.log("swap Contract USDT balance = ", await usdtTokenContract.methods.balanceOf(swapContract.address).call());
        console.log("swap Contract WETH baalnce", await wethTokenContract.methods.balanceOf(swapContract.address).call());
        console.log("swap Contract ETH baalnce", await web3.eth.getBalance(swapContract.address));

        console.log("USDT_WHALE USDT balance = ", await usdtTokenContract.methods.balanceOf(USDT_WHALE_ADDRESS).call());
        console.log("USDT_WHALE WETH baalnce", await wethTokenContract.methods.balanceOf(USDT_WHALE_ADDRESS).call());
        console.log("USDT_WHALE ETH baalnce", await web3.eth.getBalance(USDT_WHALE_ADDRESS));

        console.log("+++++++++++++++++++++++++++++++++++");

        console.log("allowance before = ", (await tokenInContract.methods.allowance(USDT_WHALE_ADDRESS, swapContract.address).call()));
       
        await tokenInContract.methods.approve(swapContract.address, amount_in).send({ from: USDT_WHALE_ADDRESS });
       
        console.log("allowance after = ", (await tokenInContract.methods.allowance(USDT_WHALE_ADDRESS, swapContract.address).call()));
        console.log("+++++++++++++++++++++++++++++++++++");

     
        usdt_whale_usdt_balance_before = await tokenInContract.methods.balanceOf(USDT_WHALE_ADDRESS).call();
        acc0_weth_balance_before = await tokenOutContract.methods.balanceOf(TO).call();

        amount_received =  await swapContract.swapExactUsdtForWeth(
            amount_in,
            TO,
            {from: USDT_WHALE_ADDRESS,}
            
        )

        console.log("RECEIVED:", amount_received)
        usdt_whale_usdt_balance_after = await tokenInContract.methods.balanceOf(USDT_WHALE_ADDRESS).call();
        acc0_weth_balance_after = await tokenOutContract.methods.balanceOf(TO).call()

        assert.isAbove(Number(acc0_weth_balance_after),0);
        assert.equal(Number(usdt_whale_usdt_balance_after), Number(usdt_whale_usdt_balance_before)-Number(amount_in));


        console.log("acc0 USDT balance = ", await usdtTokenContract.methods.balanceOf(TO).call());
        console.log("acc0 WETH baalnce = ", await wethTokenContract.methods.balanceOf(TO).call());
        console.log("acc0 ETH baalnce = ", await web3.eth.getBalance(TO));

        console.log("swap Contract USDT balance = ", await usdtTokenContract.methods.balanceOf(swapContract.address).call());
        console.log("swap Contract WETH baalnce", await wethTokenContract.methods.balanceOf(swapContract.address).call());
        console.log("swap Contract ETH baalnce", await web3.eth.getBalance(swapContract.address));

        console.log("USDT_WHALE USDT balance = ", await usdtTokenContract.methods.balanceOf(USDT_WHALE_ADDRESS).call());
        console.log("USDT_WHALE WETH baalnce", await wethTokenContract.methods.balanceOf(USDT_WHALE_ADDRESS).call());
        console.log("USDT_WHALE ETH baalnce", await web3.eth.getBalance(USDT_WHALE_ADDRESS));

    });

   


});