import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { shouldBehaveLikeSpaceCoins } from "./SpaceCoins.behavior";
import { deploySpaceCoinsFixture } from "./SpaceCoins.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("SpaceCoins", function () {
    beforeEach(async function () {
      const { spaceCoins } = await this.loadFixture(deploySpaceCoinsFixture);
      this.spaceCoins = spaceCoins;
    });

    shouldBehaveLikeSpaceCoins();
  });
});
