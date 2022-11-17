import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { SpaceAdventures } from "../../types/contracts/SpaceAdventures";
import type { SpaceAdventures__factory } from "../../types/factories/contracts/SpaceAdventures__factory";

export async function deploySpaceAdventuresFixture(): Promise<{ spaceAdventures: SpaceAdventures }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const spaceAdventuresFactory: SpaceAdventures__factory = <SpaceAdventures__factory>await ethers.getContractFactory("SpaceAdventures", {
    signer: admin,
  });
  const spaceAdventures: SpaceAdventures = <SpaceAdventures>await spaceAdventuresFactory.connect(admin).deploy();
  await spaceAdventures.deployed();
  return { spaceAdventures };
}
