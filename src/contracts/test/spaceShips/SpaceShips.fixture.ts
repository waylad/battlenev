import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { Cars } from "../../types/contracts/Cars";
import type { Cars__factory } from "../../types/factories/contracts/Cars__factory";

export async function deployCarsFixture(): Promise<{ cars: Cars }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const carsFactory: Cars__factory = <Cars__factory>await ethers.getContractFactory("Cars", {
    signer: admin,
  });
  const cars: Cars = <Cars>await carsFactory.connect(admin).deploy();
  await cars.deployed();
  return { cars };
}
