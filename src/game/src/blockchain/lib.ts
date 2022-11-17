import { ethers } from 'ethers'

import { contracts, state } from '../state/state'
import { CarToken } from '../state/stateTypes'

const CarsAbi = require('./abi/Cars.json')
import type { Cars } from './types/contracts/Cars'

declare var window: any
let provider: ethers.providers.Web3Provider
let signer: ethers.providers.JsonRpcSigner
let address: string
let carsContractWithSigner: Cars

export const connectWallet = async () => {
  provider = new ethers.providers.Web3Provider(window.ethereum)
  const { chainId } = await provider.getNetwork()
  console.log(chainId)

  state.contracts = contracts[chainId]
  if (!state.contracts || !state.contracts.carsContract)
    throw new Error('Wrong Network. Please connect Metamask to the correct testnet.')

  await provider.send('eth_requestAccounts', [])

  signer = provider.getSigner()
  address = await signer.getAddress()

  const carsContract = new ethers.Contract(state.contracts.carsContract, CarsAbi, provider)
  carsContractWithSigner = <Cars>carsContract.connect(signer)
}

export const getCars = async () => {
  const ownedCarsIds = await carsContractWithSigner.getTokensOwnedByMe()
  ownedCarsIds.forEach(async (ownedCarsId) => {
    const carMeta = await carsContractWithSigner.tokenMeta(ownedCarsId)
    state.ownedCars.push({
      tokenId: carMeta[0].toNumber(),
      carCode: carMeta[3].replace('https://zombax.io/assets/cars/', '').replace('.json', ''),
      price: carMeta[1].toNumber(),
      owned: true,
    })
  })
  console.log(state.ownedCars)

  const onSaleCarsIds = await carsContractWithSigner.getAllOnSale()
  onSaleCarsIds.forEach(async (onSaleCar) => {
    state.onSaleCars.push({
      tokenId: onSaleCar[0].toNumber(),
      carCode: onSaleCar[3].replace('https://zombax.io/assets/cars/', '').replace('.json', ''),
      price: onSaleCar[1].toNumber(),
      owned: false,
    })
  })
  console.log(state.onSaleCars)
}

export const mintRandomCar = async () => {
  const receipt = await carsContractWithSigner.randomMint()
  //   {
  //   value: 10000000,
  // })
  const tx = await receipt.wait()
  console.log(tx)
}

export const buyCar = async (carToken: CarToken) => {
  const receipt = await carsContractWithSigner.purchaseToken(carToken.tokenId, {
    value: carToken.price,
  })
  const tx = await receipt.wait()
  console.log(tx)
}

export const sellCar = async (carToken: CarToken, price: number) => {
  const receipt = await carsContractWithSigner.setTokenSale(carToken.tokenId, true, price)
  const tx = await receipt.wait()
  console.log(tx)
}

export const upgradeCar = async (carToken: CarToken) => {
  const receipt = await carsContractWithSigner.updateTokenUri(
    carToken.tokenId,
    `https://zombax.io/assets/cars/${carToken.carCode}.json`,
  )
  const tx = await receipt.wait()
  console.log(tx)
}
