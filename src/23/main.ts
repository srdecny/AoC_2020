import * as R from "ramda"
import { Circular, Node } from "singlie"

const input = [..."368195742"].map(Number)
const testinput = [..."389125467"].map(Number)


const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
}
var modulo = R.partialRight(mod, [input.length])

const round = (cups: number[], current: number): [number[], number] => {
    const currentLabel = cups[current]
    const cupsLength = cups.length
    const removed = [1,2,3].map(d => cups[modulo(current + d)])
    cups = cups.filter(c => removed.indexOf(c) == -1)

    const destination = [1,2,3,4].map(d => currentLabel - d).map(d => d < 1 ? d + cupsLength : d).find(label => removed.indexOf(label) == -1)
    const destinationIndex = cups.findIndex(c => c == destination) + 1
    cups = cups.slice(0, destinationIndex).concat(removed).concat(cups.slice(destinationIndex))
    const newCurrent = modulo(cups.indexOf(currentLabel) + 1)
    return [cups, newCurrent]
}

var part1Input = [...input]
var part1Current = 0;
[...Array(100).keys()].forEach(_ => {
    [part1Input, part1Current] = round(part1Input, part1Current)
})

const part1 = part1Input.concat(part1Input).slice(part1Input.findIndex(i => i == 1)).slice(1, 9).join("")
console.log(`Part 1: ${part1}`)
if (part1 != "95648732") throw Error("failed assert")


type Indices = {[keyof: number]: Node}

const initialize = (arr: number[]): Indices => {
    const linear = new Circular()
    const indices: Indices = {}
    arr.forEach(n => {
        linear.append(n)
        indices[n] = linear.last
    })
    return indices
}

var indices = initialize([...input].concat([...Array(1_000_001).keys()].splice(10)))
var active = 3
const cupsLength = Object.keys(indices).length

const optimizedCups = (indices: Indices, active: number): [Indices, number] => {
    const currentCup = indices[active]
    const chainStart = currentCup.next
    const chainEnd = chainStart.next.next

    currentCup.next = chainEnd.next

    const chainNumbers = [chainStart.value, chainStart.next.value, chainEnd.value]
    const nextNumber = [1,2,3,4].map(d => currentCup.value - d)
            .map(d => d < 1 ? d + cupsLength : d)
            .find(n => chainNumbers.indexOf(n) == -1)

    const destination = indices[nextNumber]

    chainEnd.next = destination.next
    destination.next = chainStart
    
    const newActive = currentCup.next.value
    return [indices, newActive]
}

for (var i = 0; i < 10_000_000; i++) {
    [indices, active] = optimizedCups(indices, active)
}

const first = indices[1].next.value
const second = indices[1].next.next.value
console.log(`Part 2: ${first * second}`)