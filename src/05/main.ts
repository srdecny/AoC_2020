import { getLines } from "../utils"
import * as R from "ramda"

interface Pass {
    column: number
    row: number
}

const createPass = (line: string): Pass => {
    const row = [...line].slice(0, 7).reverse()
    const column = [...line].slice(7).reverse()

    const decodeBinary = (a: string[], bit: string): number => {
        return a.reduce((acc, c, idx) => acc += (c == bit ? 2**idx : 0), 0)
    }
    return {
        row: decodeBinary(row, "B"),
        column: decodeBinary(column, "R")
    }
}

const calculateSeatId = (p: Pass): number => { return p.column + p.row * 8 }

const passes = getLines("input.txt").map(createPass).sort()
const part1 = Math.max(...passes.map(calculateSeatId))
console.log(`Part 1: ${part1}`)

const part2 = passes
        .map(calculateSeatId)
        .sort()
        .find((v, idx, arr) => arr[idx + 1] == v + 2)

// Incrementing because found the seat before ours
console.log(`Part 2: ${part2 + 1}`)