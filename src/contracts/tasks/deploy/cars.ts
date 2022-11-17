import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Cars } from "../../types/contracts/Cars";
import type { Cars__factory } from "../../types/factories/contracts/Cars__factory";

task("deploy:Cars")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const carsFactory: Cars__factory = <Cars__factory>await ethers.getContractFactory("Cars");
    const cars: Cars = <Cars>await carsFactory.connect(signers[0]).deploy();
    await cars.deployed();
    console.log("Cars deployed to: ", cars.address);
  });
