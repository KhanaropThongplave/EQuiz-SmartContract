// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EQuizToken is ERC20 {
    address public tokenOwner;

    event TransferToken(
        address indexed ownerAddress,
        address indexed claimerAddress,
        uint256 indexed transferAmount
    );

    constructor() ERC20("EQuiz Token", "EQT") {
        tokenOwner = msg.sender;

        uint256 number_of_tokens = 10000000000;
        _mint(msg.sender, number_of_tokens * 10**uint(decimals()));
    }

    function claim(uint256 token_amount)
        external
        returns (bool)
    {
        uint256 transfer_amount = token_amount * 1 wei * 10**uint(decimals());
        require(balanceOf(tokenOwner) >= transfer_amount, "Not enough token");

        _transfer(tokenOwner, msg.sender, transfer_amount);
        emit TransferToken(tokenOwner, msg.sender, transfer_amount);

        return true;
    }
}