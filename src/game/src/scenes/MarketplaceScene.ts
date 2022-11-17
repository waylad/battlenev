import { CarToken } from 'state/stateTypes'

import { buyCar, getCars, mintRandomCar, sellCar } from '../blockchain/lib'
import { state } from '../state/state'

export class MarketplaceScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Marketplace',
    })
  }

  init(): void {}

  preload(): void {}

  displayCar(this: Phaser.Scene, car: CarToken, i: number, j: number) {
    const carCell = this.add.image(0, 0, 'car-bg')
    const partCar = this.add.image(0, 0, `car${car.carCode[0]}`)
    const partBoost = this.add.image(0, 0, `boost${car.carCode[1]}`)
    const partWeight = this.add.image(0, 0, `weight${car.carCode[2]}`)
    const partGun = this.add.image(0, 0, `gun${car.carCode[3]}`)
    const partGear = this.add.image(0, 0, `gear${car.carCode[4]}`)
    const partArmor = this.add.image(0, 0, `armor${car.carCode[5]}`)
    const partWheel = this.add.image(0, 0, `wheel${car.carCode[6]}`)
    const partFuel = this.add.image(0, 0, `fuel${car.carCode[7]}`)

    const textPrice = this.add
      .text(20, 145, `${car.price / 1000000} TRX`, {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 140, useAdvancedWrap: true },
      })
      .setFontSize(30)
      .setOrigin(0)
      .setColor('#ECE0C4')

    // Buy
    let buttonBuy: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (!car.owned) buttonBuy = this.add.image(-80, 160, 'button-small')
    buttonBuy.setInteractive({ cursor: 'pointer' })
    buttonBuy.on('pointerdown', async () => {
      await buyCar(car)
      await getCars()
      this.scene.restart()
    })
    let textBuy: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (!car.owned)
      textBuy = new Phaser.GameObjects.Text(this, -110, 144, 'BUY', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 140, useAdvancedWrap: true },
      })
        .setFontSize(30)
        .setOrigin(0)
        .setColor('#ECE0C4')

    // Select
    let buttonSelect: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (car.owned) buttonSelect = this.add.image(-80, 160, 'button-small')
    buttonSelect.setInteractive({ cursor: 'pointer' })
    buttonSelect.on('pointerdown', async () => {
      state.currentCar = car
      this.scene.start('Garage')
    })
    let textSelect: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (car.owned)
      textSelect = new Phaser.GameObjects.Text(this, -135, 144, 'SELECT', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 140, useAdvancedWrap: true },
      })
        .setFontSize(30)
        .setOrigin(0)
        .setColor('#ECE0C4')

    // Sell
    let buttonSell: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (car.owned) buttonSell = this.add.image(80, 160, 'button-small')
    buttonSell.setInteractive({ cursor: 'pointer' })
    buttonSell.on('pointerdown', async () => {
      const price = parseInt(prompt('Please enter your price', '1000000') || '1000000')
      await sellCar(car, price)
      await getCars()
    })
    let textSell: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (car.owned)
      textSell = new Phaser.GameObjects.Text(this, 50, 144, 'SELL', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 140, useAdvancedWrap: true },
      })
        .setFontSize(30)
        .setOrigin(0)
        .setColor('#ECE0C4')

    let carContainer = this.add.container(0, 0, [
      partCar,
      partBoost,
      partWeight,
      partGun,
      partGear,
      partArmor,
      partWheel,
      partFuel,
    ])
    carContainer.setScale(0.4)

    this.add.container(
      this.sys.canvas.width / 2 - 580 + (i % 4) * 380,
      this.sys.canvas.height / 2 - 230 + j * 400,
      [carCell, textPrice, carContainer, buttonBuy, buttonSelect, buttonSell, textBuy, textSelect, textSell],
    )
  }

  create(): void {
    this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      'background',
    )

    this.add.rectangle(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      0x000000,
      0.7,
    )

    this.add
      .text(50, 65, 'MY CARS', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 240, useAdvancedWrap: true },
      })
      .setFontSize(30)
      .setOrigin(0)
      .setColor('#ECE0C4')

    for (let i = 0; i < 4; i++) {
      let car = state.ownedCars[i]
      if (car && car.carCode) {
        this.displayCar(car, i, 0)
      }
    }

    this.add
      .text(50, 450, 'MARKETPLACE', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 240, useAdvancedWrap: true },
      })
      .setFontSize(30)
      .setOrigin(0)
      .setColor('#ECE0C4')

    for (let i = 0; i < 4; i++) {
      let car = state.onSaleCars[i]
      if (car && car.carCode) {
        this.displayCar(car, i, 1)
      }
    }

    // Mint Random Button
    const buttonBg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height - 100, 'button-big')
    buttonBg.setInteractive({cursor: 'pointer'})
    
    const buttonText = this.add
    .text(this.sys.canvas.width / 2, this.sys.canvas.height - 100, 'MINT RANDOM FOR 10 MATIC', {
      fontFamily: 'Electrolize',
      align: 'center',
      wordWrap: { width: 600, useAdvancedWrap: true },
    })
    .setFontSize(34)
    .setOrigin(0.5)

    buttonBg.on('pointerdown', async () => {
      buttonText.setText('LOADING...')
      try {
        await mintRandomCar()
        await getCars()
      } catch (e: any) {
        console.log(e)
        buttonText.setText('MINT RANDOM FOR 10 MATIC')
        alert(e)
      }
    })
  }

  update(): void {}
}
