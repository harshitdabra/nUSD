// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract nUSD {
    string public name = "nUSD";
    string public symbol = "nUSD";
    uint8 public decimals = 18;

    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    AggregatorV3Interface internal priceFeed;

    event Deposit(address indexed user, uint256 amount);
    event Redeem(address indexed user, uint256 amount);

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function deposit(uint256 ethAmount) external {
        require(ethAmount > 0, "Amount must be greater than zero");

        uint256 nUsdAmount = ethAmount / 2;

        balanceOf[msg.sender] += nUsdAmount;
        totalSupply += nUsdAmount;

        emit Deposit(msg.sender, ethAmount);
    }

    function redeem(uint256 nUsdAmount) external {
        require(nUsdAmount > 0, "Amount must be greater than zero");
        require(
            balanceOf[msg.sender] >= nUsdAmount,
            "Insufficient nUSD balance"
        );

        uint256 ethAmount = nUsdAmount * 2;

        balanceOf[msg.sender] -= nUsdAmount;
        totalSupply -= nUsdAmount;

        payable(msg.sender).transfer(ethAmount);

        emit Redeem(msg.sender, ethAmount);
    }

    function updatePriceFeed(address _priceFeed) external {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getETHPrice() internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price feed");
        return uint256(price);
    }

    function getETHValue(uint256 nUsdAmount) public view returns (uint256) {
        uint256 ethPrice = getETHPrice();
        return nUsdAmount * 2 * ethPrice;
    }
}
