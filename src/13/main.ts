import { getLines } from "../utils"
import * as R from "ramda"

const lines = getLines("input.txt")
const start = Number(lines[0])
const ids = lines[1].split(",").filter(id => id != "x").map(Number)

const earliestBus = ids.reduce((acc, c) => {
    const waitTime = c - start % c
    console.log(waitTime)
    if (acc.minWait > waitTime) {
        acc.minWait = waitTime
        acc.busId = c
    }
    return acc
}, {minWait: 100000, busId: 0})


console.log(`Day 1: ${earliestBus.busId * earliestBus.minWait}`)


// https://stackoverflow.com/a/51562038
// Not implementing this myself.
function modInverse(a: number, m: number): number {
  // validate inputs
  [a, m] = [Number(a), Number(m)]
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN // invalid input
  }
  a = (a % m + m) % m
  if (!a || m < 2) {
    return NaN // invalid input
  }
  // find the gcd
  const s = []
  let b = m
  while(b) {
    [a, b] = [b, a % b]
    s.push({a, b})
  }
  if (a !== 1) {
    return NaN // inverse does not exists
  }
  // find the inverse
  let x = 1
  let y = 0
  for(let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y,  x - y * Math.floor(s[i].a / s[i].b)]
  }
  const inverse = (y % m + m) % m
  return inverse
}

// Chinese remainder theorem
const equations = lines[1].split(",").map((c, idx) => [Number(c), idx]).filter(([c, _]) => !isNaN(c))
const totalModulo = BigInt(equations.reduce((acc, c) => acc *= c[0], 1))
const solution: BigInt = equations.reduce((acc, [modulo, remainder], idx) => {

    const s = equations.filter((_, i) => i != idx).map(x => x[0]).reduce(R.multiply, 1)
    const t = modInverse(s, modulo) % modulo
    const q = (BigInt(s) * BigInt(t)) % totalModulo
    acc += (BigInt(modulo - remainder)) * q
    return acc  
}, 0n) % totalModulo

console.log(`Part 2: ${solution}`)
