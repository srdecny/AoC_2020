import { getLines, range } from "../utils"
import * as R from "ramda"

interface Sum {
   n: number,
   pairs: number[]
}

type Sums = Sum[]

const numbers = getLines("input.txt").map(Number)
const preamble = numbers.slice(0, 25)
const rest = numbers.slice(25)

const checkSums = (s: Sums, n: number): boolean => {
    return s.flatMap(s => s.pairs).indexOf(n) !== -1
}

const addNewSums = (s: Sums, n: number): Sums => {
   s.forEach(s => s.pairs.push(s.n + n))
   s.push({n: n, pairs: []})
   return s
}

var startingSums = preamble.reduce((acc, n) => addNewSums(acc, n), [] as Sums)

const invalidNumber = rest.find(n => {
    if (!checkSums(startingSums, n)) return true
    startingSums = addNewSums(startingSums, n).slice(1)
    return false
})

console.log(`Part 1: ${invalidNumber}`)

const weakSet = range(2, numbers.length).flatMap(size => R.aperture(size, numbers)).find(set => set.reduce(R.add) == invalidNumber)
console.log(`Part 2: ${Math.min(...weakSet) + Math.max(...weakSet)}`)