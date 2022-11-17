import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { SpaceCoins } from "../../types/contracts/SpaceCoins";
import type { SpaceCoins__factory } from "../../types/factories/contracts/SpaceCoins__factory";

export async function deploySpaceCoinsFixture(): Promise<{ spaceCoins: SpaceCoins }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const spaceCoinsFactory: SpaceCoins__factory = <SpaceCoins__factory>await ethers.getContractFactory("SpaceCoins", {
    signer: admin,
  });
  const spaceCoins: SpaceCoins = <SpaceCoins>await spaceCoinsFactory.connect(admin).deploy();
  await spaceCoins.deployed();
  return { spaceCoins };
}
