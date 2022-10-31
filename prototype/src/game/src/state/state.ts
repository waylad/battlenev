import { Contracts, State } from './stateTypes'

export const contracts: Contracts = {
  5: {
    //goerli
    carsContract: '0x0D50D84d7EBd272A7274eaD20FE7a14F4CE80987',
    },
  15555: {
    //trust-testnet
    carsContract: '',
  },
}

export let state: State = {
  // start vertical point of the terrain, 0 = very top; 1 = very bottom
  startTerrainHeight: 0.5,
  // max slope amplitude, in pixels
  amplitude: 100,
  // slope length range, in pixels
  slopeLength: [150, 350],
  // a mountain is a a group of slopes.
  mountainsAmount: 3,
  // amount of slopes for each mountain
  slopesPerMountain: 6,
  // car acceleration
  carAcceleration: 0.01,
  // maximum car velocity
  maxCarVelocity: 1,
  // rocks ratio, in %
  rocksRatio: 5,
  // mountain colors
  mountainColors: [0x39332D, 0x6C655E, 0x2d2c2c, 0x3a3232, 0x2d2c2c],
  // line width for each mountain color, in pixels
  mountainColorsLineWidth: [0, 70, 100, 110, 500],
  paused: false,
  contracts: {
    carsContract: undefined,
  },
  ownedCars: [],
  onSaleCars: [],
  currentCar: null,
}
