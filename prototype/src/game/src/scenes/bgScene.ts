export class BgScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Bg',
    })
  }

  private preload(): void {}

  private create(): void {
    const bgLevel = this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      'bg-level',
    )
  }
}
