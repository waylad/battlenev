export class BgScene extends Phaser.Scene {
  constructor(aParams) {
    super({
      key: 'Bg',
    })
  }

  private preload(): void {}

  private create(): void {
    const bgLevel = this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width /2,
      this.sys.canvas.height /2,
      'bg-level',
    )

    bgLevel.setDepth(-1000);
  }
}
