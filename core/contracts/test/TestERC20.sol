// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TestERC20 is ERC20 {
    constructor() ERC20("TestERC20", "TERC20") {}

    function mint(uint amount, address account) public {
        _mint(account, amount);
    }
}