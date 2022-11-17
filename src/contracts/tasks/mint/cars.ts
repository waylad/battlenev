import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Cars } from "../../types/contracts/Cars";
import type { Cars__factory } from "../../types/factories/contracts/Cars__factory";

task("mint:Cars")
  .addParam("address", "")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const carsFactory: Cars__factory = <Cars__factory>await ethers.getContractFactory("Cars");
    const cars: Cars = <Cars>(
      await carsFactory.connect(signers[0]).attach(taskArguments.address)
    );

    // Car Boost Weight Gun Gear Armor Wheel Fuel
    // CBWGGAWF
    // 01010330

    const mint1 = await cars
      .connect(signers[0])
      .mintCollectable(signers[0].address, "https://zombax.io/assets/cars/00000000.json", "Genesis Car", 30000000, true); //0.03 ETH
    await mint1.wait();

    const mint2 = await cars
      .connect(signers[0])
      .mintCollectable(signers[0].address, "https://zombax.io/assets/cars/00000000.json", "Genesis Car", 3000000, true);  //0.003 ETH
    await mint2.wait();

    const mint3 = await cars
      .connect(signers[0])
      .mintCollectable(signers[0].address, "https://zombax.io/assets/cars/00000110.json", "Genesis Car", 1000000, true);
    await mint3.wait();

    const mint4 = await cars
      .connect(signers[0])
      .mintCollectable(signers[0].address, "https://zombax.io/assets/cars/00000030.json", "Genesis Car", 2000000, true);
    await mint4.wait();

    const mint5 = await cars
      .connect(signers[0])
      .mintCollectable(signers[0].address, "https://zombax.io/assets/cars/00000000.json", "Genesis Car", 3000000, true);
    await mint5.wait();

    const mint6 = await cars
      .connect(signers[0])
      .mintCollectable(signers[0].address, "https://zombax.io/assets/cars/01010330.json", "Genesis Car", 4000000, true);
    await mint6.wait();

    const carsOnSale = await cars.connect(signers[0]).getAllOnSale();
    console.log(carsOnSale);

    console.log('DONE')
  });
