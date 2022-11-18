const { readFileSync, writeFileSync, readdirSync, rmSync, existsSync, mkdirSync } = require('fs')
const { create } = require('ipfs-http-client')
require('dotenv').config()

const projectId = process.env.INFURA_API_ID
const projectSecret = process.env.INFURA_API_SECRET
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

// const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

// Car Boost Weight Gun Gear Armor Wheel Fuel
// CBWGGAWF
// 01010330

const template = `
    <svg width="230" height="230" viewBox="0 0 230 230" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- car -->
        <!-- boost -->
        <!-- weight -->
        <!-- gun -->
        <!-- gear -->
        <!-- armor -->
        <!-- wheel -->
        <!-- fuel -->
    </svg>
`

function randInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

function randElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getLayer(name, skip = 0.0) {
  const svg = readFileSync(`./layers/${name}.svg`, 'utf-8')
  const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
  const layer = svg.match(re)[0]
  return Math.random() > skip ? layer : ''
}

async function svgToPng(name) {
  const src = `./out/${name}.svg`
  const dest = `./out/${name}.png`

  await svg_to_png.convert(src, dest)

  //   const img = await sharp(src);
  //   await img.png({ progressive: true, adaptiveFiltering: true, palette: true }).toFile(dest);
}

async function createImage(car, boost, weight, gun, gear, armor, wheel, fuel) {
  // Step 1: Generate images
  const image = template
    .replace('<!-- car -->', getLayer(`car${car}`))
    .replace('<!-- boost -->', getLayer(`boost${boost}`))
    .replace('<!-- weight -->', getLayer(`weight${weight}`))
    .replace('<!-- gun -->', getLayer(`gun${gun}`))
    .replace('<!-- gear -->', getLayer(`gear${gear}`))
    .replace('<!-- armor -->', getLayer(`armor${armor}`))
    .replace('<!-- wheel -->', getLayer(`wheel${wheel}`))
    .replace('<!-- fuel -->', getLayer(`fuel${fuel}`))

  const carCode = `${car}${boost}${weight}${gun}${gear}${armor}${wheel}${fuel}`
  writeFileSync(`./out/${carCode}.svg`, image)

  // Step 2: Upload images to IPFS
  const upload = await client.add(image)
  console.log(`Car ${carCode} uploaded to ipfs://${upload.path}`)

  // Step 3: Generate Metadata
  const meta = {
    name: `Zombax Car ${carCode}`,
    description: 'A Zombax Upgradable Car',
    external_url: `https://vrf.zombax.io/assets/cars/${carCode}.svg`,
    image: `ipfs://${upload.path}`,
    attributes: [
      {
        car,
        rarity: 0.25,
      },
      {
        boost,
        rarity: 0.25,
      },
      {
        weight,
        rarity: 0.25,
      },
      {
        gun,
        rarity: 0.25,
      },
      {
        gear,
        rarity: 0.25,
      },
      {
        armor,
        rarity: 0.25,
      },
      {
        wheel,
        rarity: 0.25,
      },
      {
        fuel,
        rarity: 0.25,
      },
    ],
  }

  writeFileSync(`./out/${car}${boost}${weight}${gun}${gear}${armor}${wheel}${fuel}.json`, JSON.stringify(meta))
}

// Create dir if not exists
if (!existsSync('./out')) {
  mkdirSync('./out')
}

// Cleanup dir before each run
readdirSync('./out').forEach((f) => rmSync(`./out/${f}`))

for (let car = 0; car <= 0; car++) {
  for (let boost = 0; boost <= 3; boost++) {
    for (let weight = 0; weight <= 3; weight++) {
      for (let gun = 0; gun <= 3; gun++) {
        for (let gear = 0; gear <= 3; gear++) {
          for (let armor = 0; armor <= 3; armor++) {
            for (let wheel = 0; wheel <= 3; wheel++) {
              for (let fuel = 0; fuel <= 3; fuel++) {
                createImage(car, boost, weight, gun, gear, armor, wheel, fuel)
              }
            }
          }
        }
      }
    }
  }
}
