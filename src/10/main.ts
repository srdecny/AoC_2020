import { getLines } from "../utils"
import * as R from "ramda"

const r = getLines("input.txt").map(Number)
const ratings = r.concat([0, Math.max(...r) + 3])

ratings.sort((a, b) => Math.max(a - b) <= 3 && a < b ? -1 : 1)
const differences = R.aperture(2, ratings)
        .map(r => r[1] - r[0])
        .filter(r => r != 2)
        .reduce((acc, c) => { acc[c] += 1; return acc } , {1: 0, 3: 0} as any)
console.log(`Part 1: ${differences[1] * differences[3]}`)

const startingAcc: { [key: number]: number} = {}
startingAcc[R.reverse(ratings)[0]] = 1
const combinations = R.reverse(ratings).reduce((acc, c) => {
    const prev3 = [0,1,2,3].map(i => acc[c + i] || 0).reduce(R.add)
    acc[c] = prev3
    return acc
}, startingAcc)

console.log(`Part 2: ${combinations[0]}`)