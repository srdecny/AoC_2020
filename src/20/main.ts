import { getLines } from "../utils"
import * as R from "ramda"

type Tile = string[][]
type Tiles = {[keyof: string]: Tile}
const tiles = getLines("input.txt").concat("").reduce((acc, c) => {
    if (c == "") {
        acc.tiles[acc.currId] = acc.curr
        acc.curr = []
    } else if (c.startsWith("Tile")) {
        const [id] = c.match(/(\d+)/).splice(1)
        acc.currId = id
    } else {
        acc.curr.push([...c])
    }
    return acc
},{curr: [], currId: "", tiles: {}} as {curr: string[][], currId: string, tiles: Tiles}).tiles


const tileRotations = (tile: Tile): Tile[] => {
    const rotateRight = (tile: Tile): Tile => {
        return R.transpose(tile).reverse()
    }
    const flipped = R.transpose(tile)
    return [
        tile,
        rotateRight(tile),
        rotateRight(rotateRight(tile)),
        rotateRight(rotateRight(rotateRight(tile))),
        flipped,
        rotateRight(rotateRight(rotateRight(flipped))),
        rotateRight(rotateRight(flipped)),
        rotateRight(flipped),
    ]
}

const getBorders = (tile: Tile): string[] => tileRotations(tile).map(t => t[0].join(""))

const allBorders = Object.values(tiles).reduce((acc, tile) => {
    return acc.concat(getBorders(tile))
}, [] as string[])

// Observe that all borders appear only once or twice, so there is only one solution (each tile matches with only one tile)
const counts = allBorders.reduce((acc, c) => {
    if (!acc[c]) acc[c] = 1
    else acc[c] += 1
    return acc
}, {} as any)

const singletonBorders = new Set<string>(Object.keys(counts).filter(border => counts[border] == 1))

const corners = Object.keys(tiles).filter(key => {
    const borders = getBorders(tiles[key])
    if (borders.filter(b => singletonBorders.has(b)).length == 4) {
        return key
    }
})

console.log(`Part 1: ${corners.map(Number).reduce(R.multiply)}`)

const printTile = (t: Tile) =>  { t.forEach(l => {console.log(l.join(""))}); console.log("")}

type Image = Tile[][]
const findMatching = (t: Tile): string[] => {
    const borders = new Set<string>(getBorders(t).slice(0, 4))
    return Object.keys(tiles).filter(otherTile => {
       return getBorders(tiles[otherTile]).filter(b => borders.has(b)).length == 1 
    })
}

const neighbours = Object.keys(tiles).reduce((acc, c) => {
    acc[c] = findMatching(tiles[c])
    return acc
}, {} as {[keyof: string]: string[]})


const findOrientation = (tile: Tile, orientation: number, border: string): Tile => {
    border = [...border].reverse().join("")
    return tileRotations(tile).find(tile => getBorders(tile).indexOf(border) == (orientation + 2) % 4)
}

// Not proud of this.
const image = (start: string) => {
    const queue = [...neighbours[start]]
    const resolved = {[start]: {tile: tileRotations(tiles[start])[7], x: 0, y: 0}} as {[keyof: string]: {left?: string, down?: string, up?: string, right?: string, tile: Tile, x: number, y: number}}
    while (queue.length > 0) {
        const id = queue.pop()
        if (!resolved[id]) {
            var tile = tiles[id]
            const resolvedNeighbourId = neighbours[id].find(n => resolved[n])
            const resolvedNeighbour = resolved[resolvedNeighbourId]
            const neighbourBorders = getBorders(resolvedNeighbour.tile).splice(0, 4)

            const matchingBorder = getBorders(tile).find(border => neighbourBorders.indexOf(border) !== -1)
            const direction = neighbourBorders.indexOf(matchingBorder)

            tile = findOrientation(tile, direction, matchingBorder)
            var orientation = {}
            switch(direction) {
                case 2:
                    orientation = {top: resolvedNeighbourId, y: resolvedNeighbour.y + 1, x: resolvedNeighbour.x}
                    resolvedNeighbour.down = id
                    break
                case 1:
                    orientation = {left: resolvedNeighbourId, x: resolvedNeighbour.x + 1, y: resolvedNeighbour.y}
                    resolvedNeighbour.right = id
                    break
                case 0:
                    orientation = {down: resolvedNeighbourId, y: resolvedNeighbour.y - 1, x: resolvedNeighbour.x}
                    resolvedNeighbour.up = id
                    break
                case 3:
                    orientation = {right: resolvedNeighbourId, x: resolvedNeighbour.x - 1, y: resolvedNeighbour.y}
                    resolvedNeighbour.left = id
                    break
            }

            resolved[id] = {tile: tile, ...orientation}
            neighbours[id].forEach(n => queue.push(n))
        }
            

    }
    return resolved
}
//const im = image(corners[1])
const im = (image(corners[2]))
const maxX = Math.max(...Object.values(im).map(im => im.x))
const maxY = Math.max(...Object.values(im).map(im => im.y))

const gluedImage: string[][] = []
for (var y = 0; y <= maxY; y++) {
    for (var x = 0; x <= maxX; x++) {
        const tile = Object.values(im).find(p => p.x == x && p.y == y).tile
        tile.forEach((line, idx) => {
            if (idx != 0 && idx != tile.length - 1) {
                const trimmed = line.slice(1, -1)
                const newIdx = (y*8) + idx 
                if (!gluedImage[newIdx]) { gluedImage[newIdx] = [] }
                gluedImage[newIdx] = gluedImage[newIdx].concat(trimmed)
            }
        })
    }
}
gluedImage.shift()

const findMonsters = (image: string[][]): number => {
    var monsterCount = 0
    for (var y = 0; y <= image.length - 3; y++) {
        for (var x = 0; x <= image[0].length - 20; x++) {
            const lines = [0,1,2].map(n => image[y + n].slice(0+x, 20+x).join(""))
            if (/^..................#./.test(lines[0]) &&
                /^#....##....##....###/.test(lines[1]) && 
                /^.#..#..#..#..#..#.../.test(lines[2])) monsterCount += 1
        }
    }

    
    return image.reduce((acc, c) => acc += c.filter(c => c == "#").length, 0) - monsterCount * 15
}

const monsters = Math.min(...tileRotations(gluedImage).map(findMonsters))
console.log(`Part 2: ${monsters}`)
