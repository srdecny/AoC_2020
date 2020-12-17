import { getLines } from "../utils"
import * as R from "ramda"

interface Coords {
    x: number,
    y: number,
    z: number,
    w: number
}

const coordsToString = (p: Coords): string => `${p.x}|${p.y}|${p.z}|${p.w}`
const stringToCoords = (s: string): Coords => {
    const coords = s.split("|").map(Number)
    return {
        x: coords[0],
        y: coords[1],
        z: coords[2],
        w: coords[3]
    }
}

type ActiveCubes = Set<string>
const startingState = getLines("input.txt").reduce((acc, c, yIdx) => {
    const coords = c.split("").reduce((acc, c, xIdx) => {
        if (c == "#") acc.push({x: xIdx, y: yIdx, z: 0, w: 0})
        return acc
    }, [] as Coords[])
    coords.map(coordsToString).forEach(s => acc.add(s))
    return acc
}, new Set<string>() as ActiveCubes)

type Rules = (isActive: boolean, activeNeighbours: number) => boolean
const gameOfLife: Rules = (isActive: boolean, activeNeighbours: number) => {
    if (isActive) {
        return activeNeighbours >= 2 && activeNeighbours <= 3
    } else {
        return activeNeighbours == 3
    }
}

type GenerateNeighbours = (self: Coords) => Coords[]
const cubeNeighbours: GenerateNeighbours = (self: Coords): Coords[] => {
    const shift = (c: Coords, fieldName: keyof Coords): Coords[] => {
        return [-1, 0, 1 ].map(diff => { return {...c, [fieldName]: c[fieldName] + diff }})
    }
    return ["x", "y", "z"].reduce((acc, key) => {
        return acc.flatMap(a => shift(a, key as keyof Coords))
    }, [self] as Coords[]).filter(c => c.x != self.x || c.y != self.y || c.z != self.z)
}

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

const part1 = [...Array(6).keys()].reduce((acc, _) => {
    return nextTick(acc, gameOfLife, cubeNeighbours)
}, startingState)

console.log(`Part 1: ${part1.size}`)

const hypercubeNeighbours: GenerateNeighbours = (self: Coords): Coords[] => {
    const shift = (c: Coords, fieldName: keyof Coords): Coords[] => {
        return [-1, 0, 1 ].map(diff => { return {...c, [fieldName]: c[fieldName] + diff }})
    }
    return ["x", "y", "z", "w"].reduce((acc, key) => {
        return acc.flatMap(a => shift(a, key as keyof Coords))
    }, [self] as Coords[]).filter(c => c.x != self.x || c.y != self.y || c.z != self.z || c.w != self.w)
}

const part2 = [...Array(6).keys()].reduce((acc, _) => {
    return nextTick(acc, gameOfLife, hypercubeNeighbours)
}, startingState)
console.log(`Part 2: ${part2.size}`)