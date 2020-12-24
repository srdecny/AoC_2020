import { getLines } from "../utils"
import * as R from "ramda"
import { start } from "repl"

const stringToCoords = (s: string): Coords => { return {x: Number(s.split("|")[0]), y: Number(s.split("|")[1])}}
const coordsToString = (c: Coords): string => { return `${c.x}|${c.y}` }
const decodePath = (input: string): string[] => {
    const letters = [...input]
    const directions = []
    while (letters.length > 0) {
        const letter = letters.shift()
        const nextLetter = letters[0]
        switch (letter) {
            case "e":
            case "w":
                directions.push(letter)
                break
            case "n":
            case "s":
                directions.push(letter + letters.shift())
                break
        }
    }
    return directions
}

const pathToCoords = (path: string[]): Coords => {
    var x = 0
    var y = 0
    path.forEach(path => {
        switch (path) {
            case "e":
                x++
                break
            case "se":
                y++
                break
            case "sw":
                x--
                y++
                break
            case "w":
                x--
                break
            case "nw":
                y--
                break
            case "ne":
                x++
                y--
                break
        }
    })

    return {x: x, y: y}
}

const paths = getLines("input.txt")
const coords = paths.map(decodePath).map(pathToCoords)
const flips = R.countBy(coordsToString, coords)
const blackCount = Object.values(flips).filter(x => x % 2 == 1).length
console.log(`Part 1: ${blackCount}`)

const blackCoords = Object.keys(flips).filter(key => flips[key] % 2 == 1)

interface Coords {
    x: number,
    y: number,
}

type ActiveCubes = Set<string>
const nextTick = (active: ActiveCubes, rules: Rules, neighbours: GenerateNeighbours): ActiveCubes => {
    const cubesToCheck = [...active].map(stringToCoords)
        .flatMap(c => [c, ...neighbours(c)])
    const uniqueCubes = [...new Set<string>(cubesToCheck.map(coordsToString))]
    return uniqueCubes.reduce((acc, cube) => {
        const isActive = (c: string) => active.has(c)
        const activeNeighbours = neighbours(stringToCoords(cube)).map(coordsToString).map(isActive).filter(x => x).length
        if (rules(isActive(cube), activeNeighbours)) {
            acc.add(cube)
        }
        return acc
    }, new Set<string>() as ActiveCubes)
}

type Rules = (isActive: boolean, activeNeighbours: number) => boolean
const gameOfLife: Rules = (isActive: boolean, activeNeighbours: number) => {
    if (isActive) {
        return activeNeighbours != 0 && activeNeighbours <= 2
    } else {
        return activeNeighbours == 2
    }
}

type GenerateNeighbours = (self: Coords) => Coords[]
const hexNeighbours: GenerateNeighbours = (self: Coords): Coords[] => {
    const diff = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]]
    return diff.map(([dx, dy]) => { return {x: self.x + dx, y: self.y + dy}})
}

const startingState = new Set<string>(blackCoords)

const part2 = [...Array(100).keys()].reduce((acc, idx) => {
    return nextTick(acc, gameOfLife, hexNeighbours)
}, startingState)
console.log(`Part 2: ${part2.size}`)