// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ContractDemo {
address private owner;
mapping(address => mapping(address => uint256)) public tokenBalances;

constructor() {
owner = msg.sender;
}

function swapTokens(address tokenA, address tokenB, uint256 amountA) public {
require(tokenBalances[msg.sender][tokenA] >= amountA, "Insufficient balance");
uint256 amountB = _getSwapAmount(tokenA, tokenB, amountA);
tokenBalances[msg.sender][tokenA] -= amountA;
tokenBalances[msg.sender][tokenB] += amountB;
}

function _getSwapAmount(address tokenA, address tokenB, uint256 amountA) internal pure returns (uint256) {
// This is a simplified example and actual implementation would depend on the specific token swap logic
return amountA;
}

function disconnect() public {
require(msg.sender == owner, "Only the owner can disconnect");
// Add any necessary cleanup logic here
}
}