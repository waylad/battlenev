import { state } from '../state/state'
import { simplify } from './simplify'
import Car from '../objects/car'

import * as MatterJS from 'matter-js'
// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter

export class GameScene extends Phaser.Scene {
  private bodyPool: any
  private rocksPool: any
  private mountainGraphics: any
  private mountainStart: any
  private body: any
  private isAccelerating: any
  private flyingText: any
  private flyingTime: any
  private wheelsColliding: any
  private diamond: any
  private frontWheel: any
  private rearWheel: any
  private testWheel: any
  private car: any
  private cursors: any

  constructor(aParams) {
    super({
      key: 'Game',
    })
    // this.cursors = this.input.keyboard.createCursorKeys()
  }

  private preload(): void {}

  private create(): void {
    this.car = new Car(this, 1000, 100)
    this.matter.world.on('collisionactive', (collisions: any, b: any, c: any) => {
      this.car.wheelsDown = { rear: false, front: false }
      collisions.pairs.forEach((pair: any) => {
        let labels: string[] = [pair['bodyA'].label, pair['bodyB'].label]
        if (labels.includes('wheelRear')) {
          this.car.wheelsDown.rear = true
        }
        if (labels.includes('wheelFront')) {
          this.car.wheelsDown.front = true
        }
      })
    })

    // creation of pool arrays
    this.bodyPool = []
    this.rocksPool = []

    // array to store mountains
    this.mountainGraphics = []

    // mountain start coordinates
    this.mountainStart = new Phaser.Math.Vector2(0, 0)

    // loop through all mountains
    for (let i = 0; i < state.mountainsAmount; i++) {
      // each mountain is a graphics object
      this.mountainGraphics[i] = this.add.graphics()

      // generateTerrain is the method to generate the terrain. The arguments are the graphics object and the start position
      this.mountainStart = this.generateTerrain(this.mountainGraphics[i], this.mountainStart)
    }

    // method to add the car, arguments represent x and y position
    // this.addCar(250, this.sys.canvas.height / 2 - 70)

    // the car is not accelerating
    // this.isAccelerating = false

    // input management
    // this.input.on('pointerdown', this.accelerate, this)
    // this.input.on('pointerup', this.decelerate, this)
    this.input.keyboard.on('keydown-RIGHT', (event) => {
      this.car.gas.right = true
    })
    this.input.keyboard.on('keyup-RIGHT', (event) => {
      this.car.gas.right = false
    })
    this.input.keyboard.on('keydown-LEFT', (event) => {
      this.car.gas.left = true
    })
    this.input.keyboard.on('keyup-LEFT', (event) => {
      this.car.gas.left = false
    })

    // collision check between the diamond and the car. Any other diamond collision is not allowed
    // this.matter.world.on(
    //   'collisionstart',
    //   function (event: any, bodyA: any, bodyB: any) {
    //     if ((bodyA.label == 'diamond' && bodyB.label != 'car') || (bodyB.label == 'diamond' && bodyA.label != 'car')) {
    //       this.scene.start('Game')
    //     }
    //   }.bind(this),
    // )

    this.flyingText = this.add
      .text(1000, 100, 'UNDER DEVELOPMENT', {
        fontFamily: 'Electrolize',
        color: '#FFFFFF',
      })
      .setFontSize(42)

    // // variable to count the time flying
    // this.flyingTime = 0

    // this event will check all active collisions
    // this.matter.world.on(
    //   'collisionactive',
    //   function (e) {
    //     e.pairs.forEach(
    //       function (p: any) {
    //         if (p.bodyA.label == 'wheel' || p.bodyB.label == 'zombie') {
    //           // p.bodyB.applyForce( p.bodyB, {x: p.bodyB.position.x, y: p.bodyB.position.y}, {x: 0.05, y: 0});
    //         }
    //       }.bind(this),
    //     )
    //   }.bind(this),
    // )
  }

  // method to generate the terrain. Arguments: the graphics object and the start position
  generateTerrain(graphics: any, mountainStart: any) {
    // place graphics object
    graphics.x = mountainStart.x

    // draw the ground
    graphics.clear()

    // array to store slope points
    let slopePoints: Phaser.Math.Vector2[] = []

    // variable to count the amount of slopes
    let slopes = 0

    // slope start point
    let slopeStart = new Phaser.Math.Vector2(0, mountainStart.y)

    // set a random slope length
    let slopeLength = Phaser.Math.Between(state.slopeLength[0], state.slopeLength[1])

    // determine slope end point, with an exception if this is the first slope of the fist mountain: we want it to be flat
    let slopeEnd =
      mountainStart.x == 0
        ? new Phaser.Math.Vector2(slopeStart.x + state.slopeLength[1] * 1.5, 0)
        : new Phaser.Math.Vector2(slopeStart.x + slopeLength, Math.random())

    // current horizontal point
    let pointX = 0

    // while we have less slopes than regular slopes amount per mountain...
    while (slopes < state.slopesPerMountain) {
      // slope interpolation value
      let interpolationVal = this.interpolate(
        slopeStart.y,
        slopeEnd.y,
        (pointX - slopeStart.x) / (slopeEnd.x - slopeStart.x),
      )

      // if current point is at the end of the slope...
      if (pointX == slopeEnd.x) {
        // increase slopes amount
        slopes++

        // next slope start position
        slopeStart = new Phaser.Math.Vector2(pointX, slopeEnd.y)

        // next slope end position
        slopeEnd = new Phaser.Math.Vector2(
          slopeEnd.x + Phaser.Math.Between(state.slopeLength[0], state.slopeLength[1]),
          Math.random(),
        )

        // no need to interpolate, we use slope start y value
        interpolationVal = slopeStart.y
      }

      // current vertical point
      let pointY = this.sys.canvas.height * state.startTerrainHeight + interpolationVal * state.amplitude

      // add new point to slopePoints array
      slopePoints.push(new Phaser.Math.Vector2(pointX, pointY))

      // move on to next point
      pointX++
    }

    // simplify the slope
    let simpleSlope = simplify(slopePoints, 1, true)

    // loop through all simpleSlope points starting from the second
    for (let i = 1; i < simpleSlope.length; i++) {
      // define a line between previous and current simpleSlope points
      let line = new Phaser.Geom.Line(simpleSlope[i - 1].x, simpleSlope[i - 1].y, simpleSlope[i].x, simpleSlope[i].y)

      // calculate line length, which is the distance between the two points
      let distance = Phaser.Geom.Line.Length(line)

      // calculate the center of the line
      let center = Phaser.Geom.Line.GetPoint(line, 0.5)

      // calculate line angle
      let angle = Phaser.Geom.Line.Angle(line)

      // if the pool is empty...
      if (this.bodyPool.length == 0) {
        // create a new rectangle body
        let body = this.matter.add.rectangle(center.x + mountainStart.x, center.y + 5, distance, 20, {
          isStatic: true,
          angle: angle,
          friction: 1,
          restitution: 0,
          collisionFilter: {
            category: 2,
          },
          label: 'ground',
        })

        // assign inPool property to check if the body is in the pool
        // @ts-ignore
        body.inPool = false
      }

      // if the pool is not empty...
      else {
        // get the body from the pool
        let body = this.bodyPool.shift()

        // change inPool property
        body.inPool = false

        // reset, reshape and move the body to its new position
        this.matter.body.setPosition(body, {
          x: center.x + mountainStart.x,
          y: center.y,
        })
        let length = body.area / 10
        this.matter.body.setAngle(body, 0)
        this.matter.body.scale(body, 1 / length, 1)
        this.matter.body.scale(body, distance, 1)
        this.matter.body.setAngle(body, angle)
      }

      // should we add a rock?
      if (Phaser.Math.Between(0, 100) < state.rocksRatio && (mountainStart.x > 0 || i != 1)) {
        // random rock position
        let size = Phaser.Math.Between(20, 30)
        let depth = Phaser.Math.Between(0, -100)
        let rockX = center.x + mountainStart.x + depth * Math.cos(angle + Math.PI / 2)
        let rockY = center.y + depth * Math.sin(angle + Math.PI / 2)

        // if the pool is empty...
        if (this.rocksPool.length == 0) {
          // create a new circle body
          const Matter = Phaser.Physics.Matter
          let group = this.matter.world.nextGroup(true)
          let rock = this.matter.add.image(rockX, rockY, 'zombie')
          rock.setScale(0.6)
          rock.setBody(
            {
              type: 'rectangle',
              width: 30,
              height: 80,
              // type: 'circle',
              // radius: 25,
            },
            {
              label: 'zombie',
              collisionFilter: {
                group: group,
              },
              density: 0.0002,
            },
          )
          // let rock = this.matter.add.circle(rockX, rockY, size, {
          //   isStatic: false,
          //   angle: angle,
          //   friction: 1,
          //   restitution: 0,
          //   density: 0.002,
          //   collisionFilter: {
          //     category: 2,
          //   },
          //   label: 'rock',
          // })

          // assign inPool property to check if the body is in the pool
          // @ts-ignore
          rock.inPool = false
        } else {
          // get the rock from the pool
          let rock = this.rocksPool.shift()

          // resize the rock
          this.matter.body.scale(rock, size / rock.circleRadius, size / rock.circleRadius)

          // move the rock to its new position
          this.matter.body.setPosition(rock, {
            x: rockX,
            y: rockY,
          })
          rock.inPool = false
        }
      }
    }

    // new way to draw the slopes
    for (let i = 0; i < state.mountainColors.length; i++) {
      graphics.moveTo(0, this.sys.canvas.height * 2)
      graphics.fillStyle(state.mountainColors[i])
      graphics.beginPath()
      simpleSlope.forEach(
        function (point: any) {
          graphics.lineTo(point.x, point.y + state.mountainColorsLineWidth[i])
        }.bind(this),
      )
      graphics.lineTo(simpleSlope[simpleSlope.length - 1].x, this.sys.canvas.height * 2)
      graphics.lineTo(0, this.sys.canvas.height * 2)
      graphics.closePath()
      graphics.fillPath()
    }

    // old way to draw the slopes
    /*graphics.moveTo(0, this.sys.canvas.height * 2);
    graphics.fillStyle(0x654b35);
    graphics.beginPath();
    simpleSlope.forEach(function(point){
        graphics.lineTo(point.x, point.y);
    }.bind(this))
    graphics.lineTo(pointX, this.sys.canvas.height * 2);
    graphics.lineTo(0, this.sys.canvas.height * 2);
    graphics.closePath();
    graphics.fillPath();*/

    // draw the grass
    graphics.lineStyle(16, 0x4E4640)
    graphics.beginPath()
    simpleSlope.forEach(function (point: any) {
      graphics.lineTo(point.x, point.y)
    })
    graphics.strokePath()

    // assign a custom "width" property to the graphics object
    graphics.width = pointX - 1

    // return the coordinates of last mountain point
    return new Phaser.Math.Vector2(graphics.x + pointX - 1, slopeStart.y)
  }

  // method to accelerate
  accelerate() {
    // this.isAccelerating = true
    this.car.gas.right = true
  }

  // method to decelerate
  decelerate() {
    // this.isAccelerating = false
    this.car.gas.right = false
  }

  // method to apply a cosine interpolation between two points
  interpolate(vFrom: any, vTo: any, delta: any) {
    let interpolation = (1 - Math.cos(delta * Math.PI)) * 0.5
    return vFrom * (1 - interpolation) + vTo * interpolation
  }

  public update(time: number, dt: number): void {
    // fix the camera to the car
    const carBody = this.car.bodies[0]
    this.cameras.main.centerOn(carBody.position.x + 200, carBody.position.y - 100)
    // set the smooth zoom
    const wheelRear = this.car.bodies[1]
    const currentZoom = this.cameras.main.zoom
    let zoom = 1 - wheelRear.angularVelocity / 5
    if (zoom > currentZoom + currentZoom * 0.002) zoom = currentZoom + currentZoom * 0.002
    else if (zoom < currentZoom - currentZoom * 0.002) zoom = currentZoom - currentZoom * 0.002
    if (zoom > 1) zoom = 1
    this.cameras.main.setZoom(zoom)
    this.car.update()

    // loop through all mountains
    this.mountainGraphics.forEach(
      function (item: any) {
        // if the mountain leaves the screen to the left...
        if (this.cameras.main.scrollX > item.x + item.width + this.sys.canvas.width - 1000) {
          // reuse the mountain
          this.mountainStart = this.generateTerrain(item, this.mountainStart)
        }
      }.bind(this),
    )

  }
}
