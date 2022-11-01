import { BodyType } from 'matter'

export default class Zombie {
  private _scene: Phaser.Scene

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    this._scene = scene

    let group = scene.matter.world.nextGroup(true)
    let body = scene.matter.add.image(x, y, 'zombie')
  }

  update() {
  }
}
