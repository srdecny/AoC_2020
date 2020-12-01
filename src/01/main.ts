import { getLines } from "../utils"
import * as R from "ramda"

const input = getLines("input.txt").map(Number)

const res1 = R.filter(x => R.any(y => x + y == 2020, input), input).reduce(R.multiply)
console.log(`Part 1: ${res1}`)

const res2 = R.filter(x => R.any(y => R.any(z => x + y + z == 2020, input), input), input).reduce(R.multiply)
console.log(`Part 2: ${res2}`)