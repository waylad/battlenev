require('dotenv').config()
import { PreloaderScene } from './scenes/preloaderScene'
import { ConnectWalletScene } from './scenes/connectWalletScene'
import { GameScene } from './scenes/gameScene'
import { GarageScene } from './scenes/garageScene'
import { MarketplaceScene } from './scenes/MarketplaceScene'
import { BgScene } from './scenes/bgScene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'BattleNEVs',
  url: 'https://battlenevs.io',
  version: '3.0',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game',
    width: 1600,
    height: 900,
  },
  scene: [PreloaderScene, ConnectWalletScene, GarageScene, GameScene, MarketplaceScene, BgScene],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
    },
  },
  backgroundColor: '#000000',
  render: { pixelArt: false, antialias: true },
}
