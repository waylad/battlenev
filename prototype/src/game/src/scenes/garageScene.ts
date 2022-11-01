import { state } from '../state/state'

export class GarageScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Garage',
    })
  }

  init(): void {}

  preload(): void {}

  replaceAt = function (original: string, index: number, replacement: string) {
    return original.substring(0, index) + replacement + original.substring(index + replacement.length)
  }

  create(): void {
    this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      'bg-garage',
    )

    const car = state.currentCar!

    let indexCar = parseInt(car.carCode[0])
    let indexBoost = parseInt(car.carCode[1])
    let indexWeight = parseInt(car.carCode[2])
    let indexGun = parseInt(car.carCode[3])
    let indexGear = parseInt(car.carCode[4])
    let indexArmor = parseInt(car.carCode[5])
    let indexWheel = parseInt(car.carCode[6])
    let indexFuel = parseInt(car.carCode[7])

    const partCar = this.add.image(0, 0, `car${indexCar}`)
    const partBoost = this.add.image(0, 0, `boost${indexBoost}`)
    const partWeight = this.add.image(0, 0, `weight${indexWeight}`)
    const partGun = this.add.image(0, 0, `gun${indexGun}`)
    const partGear = this.add.image(0, 0, `gear${indexGear}`)
    const partArmor = this.add.image(0, 0, `armor${indexArmor}`)
    const partWheel = this.add.image(0, 0, `wheel${indexWheel}`)
    const partFuel = this.add.image(0, 0, `fuel${indexFuel}`)

    let carContainer = this.add.container(this.sys.canvas.width / 2, this.sys.canvas.height / 2 - 50, [
      partCar,
      partBoost,
      partWeight,
      partGun,
      partGear,
      partArmor,
      partWheel,
      partFuel,
    ])

    const upgradeBoost = this.add.image(143, 765, `upgradeBoost${indexBoost}`)
    upgradeBoost.setInteractive({ cursor: 'pointer' })
    upgradeBoost.on('pointerdown', () => {
      indexBoost < 3 ? indexBoost += 1 : indexBoost = 0;
      state.currentCar!.carCode = this.replaceAt(state.currentCar!.carCode, 1, `${indexBoost}`)
      partBoost.setTexture(`boost${indexBoost}`)
      upgradeBoost.setTexture(`upgradeBoost${indexBoost}`)
    })

    const upgradeArmor = this.add.image(361, 765, `upgradeArmor${indexArmor}`)
    upgradeArmor.setInteractive({ cursor: 'pointer' })
    upgradeArmor.on('pointerdown', () => {
      indexArmor < 3 ? indexArmor += 1 : indexArmor = 0;
      state.currentCar!.carCode = this.replaceAt(state.currentCar!.carCode, 1, `${indexArmor}`)
      partArmor.setTexture(`armor${indexArmor}`)
      upgradeArmor.setTexture(`upgradeArmor${indexArmor}`)
    })

    const upgradeFuel = this.add.image(580, 765, `upgradeFuel${indexFuel}`)
    upgradeFuel.setInteractive({ cursor: 'pointer' })
    upgradeFuel.on('pointerdown', () => {
      indexFuel < 3 ? indexFuel += 1 : indexFuel = 0;
      state.currentCar!.carCode = this.replaceAt(state.currentCar!.carCode, 1, `${indexFuel}`)
      partFuel.setTexture(`fuel${indexFuel}`)
      upgradeFuel.setTexture(`upgradeFuel${indexFuel}`)
    })

    const upgradeGear = this.add.image(798, 765, `upgradeGear${indexGear}`)
    upgradeGear.setInteractive({ cursor: 'pointer' })
    upgradeGear.on('pointerdown', () => {
      indexGear < 3 ? indexGear += 1 : indexGear = 0;
      state.currentCar!.carCode = this.replaceAt(state.currentCar!.carCode, 1, `${indexGear}`)
      partGear.setTexture(`gear${indexGear}`)
      upgradeGear.setTexture(`upgradeGear${indexGear}`)
    })

    const upgradeGun = this.add.image(1007, 765, `upgradeGun${indexGun}`)
    upgradeGun.setInteractive({ cursor: 'pointer' })
    upgradeGun.on('pointerdown', () => {
      indexGun < 3 ? indexGun += 1 : indexGun = 0;
      state.currentCar!.carCode = this.replaceAt(state.currentCar!.carCode, 1, `${indexGun}`)
      partGun.setTexture(`gun${indexGun}`)
      upgradeGun.setTexture(`upgradeGun${indexGun}`)
    })

    const upgradeWeight = this.add.image(1236, 765, `upgradeWeight${indexWeight}`)
    upgradeWeight.setInteractive({ cursor: 'pointer' })
    upgradeWeight.on('pointerdown', () => {
      indexWeight < 3 ? indexWeight += 1 : indexWeight = 0;
      state.currentCar!.carCode = this.replaceAt(state.currentCar!.carCode, 1, `${indexWeight}`)
      partWeight.setTexture(`weight${indexWeight}`)
      upgradeWeight.setTexture(`upgradeWeight${indexWeight}`)
    })

    const upgradeWheel = this.add.image(1454, 765, `upgradeWheel${indexWheel}`)
    upgradeWheel.setInteractive({ cursor: 'pointer' })
    upgradeWheel.on('pointerdown', () => {
      indexWheel < 3 ? indexWheel += 1 : indexWheel = 0;
      state.currentCar!.carCode = this.replaceAt(state.currentCar!.carCode, 1, `${indexWheel}`)
      partWheel.setTexture(`wheel${indexWheel}`)
      upgradeWheel.setTexture(`upgradeWheel${indexWheel}`)
    })

    let buttonNext = this.add.image(this.sys.canvas.width - 200, this.sys.canvas.height - 300, 'button-play')
    buttonNext.setInteractive({ cursor: 'pointer' })
    buttonNext.on('pointerdown', () => {
      this.scene.start('Bg')
      this.scene.start('Game')
    })
  }

  update(): void {}
}
