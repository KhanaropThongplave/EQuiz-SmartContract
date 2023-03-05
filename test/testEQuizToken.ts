import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { EQuizToken, EQuizToken__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("EGame", function () {
  async function deployEGameContract() {
    const ERC20_TOKEN_DECIMALS: bigint = 1000000000000000000n;
    const NUMBER_OF_TOKENS: bigint = 10000000000n;

    const [owner, player]: SignerWithAddress[] = await ethers.getSigners();

    const mint_token: bigint = NUMBER_OF_TOKENS * ERC20_TOKEN_DECIMALS;
    const token_amount: bigint = 10000n;
    const transfer_amount: bigint = ERC20_TOKEN_DECIMALS * token_amount;

    const EQuizTokenFactory: EQuizToken__factory = await ethers.getContractFactory(
      "EQuizToken",
      {
        signer: owner,
      }
    );

    const EQuizTokenContract: EQuizToken = await EQuizTokenFactory.deploy();

    return {
      owner,
      player,
      mint_token,
      token_amount,
      transfer_amount,
      EQuizTokenContract,
    };
  }

  describe("constructor", function () {
    it("Should set the right owner", async function () {
      const { owner, EQuizTokenContract } = await loadFixture(deployEGameContract);

      expect(await EQuizTokenContract.tokenOwner()).to.eq(owner.address);
    });

    it("Should mint the right value to the owner", async function () {
      const { owner, mint_token, EQuizTokenContract } = await loadFixture(
        deployEGameContract
      );

      expect(await EQuizTokenContract.balanceOf(owner.address)).to.eq(mint_token);
    });
  });

  describe("claim", function () {
    it("Should emit TransferToken event correctly", async function () {
      const { owner, token_amount, transfer_amount, EQuizTokenContract, player } =
        await loadFixture(deployEGameContract);

      const EQuizToken: any = await EQuizTokenContract.connect(player)
        .claim(token_amount)
        .then((tx: any) => tx.wait());

      const EGameTransferTokenEvent: any = EQuizToken.events?.find(
        (emit: any) => emit.event === "TransferToken"
      );

      expect(owner.address).to.eq(EGameTransferTokenEvent?.args?.[0]);
      expect(player.address).to.eq(EGameTransferTokenEvent?.args?.[1]);
      expect(transfer_amount).to.eq(EGameTransferTokenEvent?.args?.[2]);
    });

    it("Should execute overall function flow correctly", async function () {
      const {
        owner,
        player,
        token_amount,
        mint_token,
        transfer_amount,
        EQuizTokenContract,
      } = await loadFixture(deployEGameContract);

      const owner_balance_before_transfer: number =
        Number(mint_token) / 10 ** 18;
      const owner_balance_after_transfer: number =
        Number(mint_token) / 10 ** 18 - Number(token_amount);
      const player_balance_before_transfer: number = 0;
      const player_balance_after_transfer: number = Number(token_amount);

      const ownerBalanceBeforeTransfer: number = Number(
        ethers.utils.formatEther(await EQuizTokenContract.balanceOf(owner.address))
      );

      const playerBalanceBeforeTransfer: number = Number(
        ethers.utils.formatEther(await EQuizTokenContract.balanceOf(player.address))
      );

      const EGameToken: any = await EQuizTokenContract.connect(player)
        .claim(token_amount)
        .then((tx: any) => tx.wait());

      const EGameTransferTokenEvent: any = EGameToken.events?.find(
        (event: any) => event.event === "TransferToken"
      );

      const ownerBalanceAfterTransfer: number = Number(
        ethers.utils.formatEther(await EQuizTokenContract.balanceOf(owner.address))
      );

      const playerBalanceAfterTransfer: number = Number(
        ethers.utils.formatEther(await EQuizTokenContract.balanceOf(player.address))
      );

      expect(ownerBalanceBeforeTransfer).to.eq(owner_balance_before_transfer);
      expect(playerBalanceBeforeTransfer).to.eq(player_balance_before_transfer);
      expect(ownerBalanceAfterTransfer).to.eq(owner_balance_after_transfer);
      expect(playerBalanceAfterTransfer).to.eq(player_balance_after_transfer);

      expect(owner.address).to.eq(EGameTransferTokenEvent?.args?.[0]);
      expect(player.address).to.eq(EGameTransferTokenEvent?.args?.[1]);
      expect(transfer_amount).to.eq(EGameTransferTokenEvent?.args?.[2]);
    });
  });
});