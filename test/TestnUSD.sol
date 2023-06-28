// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/nUSD.sol";

contract TestnUSD {
    function testDepositAndRedeem() public {
        nUSD nusd = nUSD(DeployedAddresses.nUSD());

        nusd.deposit(1 ether);

        uint256 nusdBalance = nusd.balanceOf(msg.sender);
        Assert.equal(nusdBalance, 500 ether, "Incorrect nUSD balance after deposit");

        nusd.redeem(250 ether);

        uint256 ethBalance = address(this).balance;
        Assert.equal(ethBalance, 0.5 ether, "Incorrect ETH balance after redeem");
    }
}
