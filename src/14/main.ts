import { getLines } from "../utils"
import * as R from "ramda"

interface Mask {
    zeroes: number[]
    ones: number[]
    floats: number[]
}


// Rolling out custom bit operations because JS's bitwise operations support only 32 bits
const zeroArray = (size: number): number[] => [...Array(size).keys()].map(_ => 0)

const numberToBits = (n: number): number[] => {
    const bits = []
    var idx = 0
    while (n / 2 != 0) {
        bits[idx] = n % 2
        idx += 1
        n = Math.floor(n / 2)
    }
    return zeroArray(36 - bits.length).concat(bits.reverse())
}

type BitOp = (n: number[]) => number

const AND: BitOp = ([x, y]) => +(x == 1 && y == 1)
const OR: BitOp = ([x, y]) => +(x == 1 || y == 1)

const bitwiseOperation = (bits: number[], n: number, op: BitOp): number => {
    const binary = numberToBits(n)
    return R.zip(bits, binary).map(pair => op(pair)).reverse().reduce((acc, c, idx) => c == 1 ? acc += 2 ** idx : acc)
}

const not = (bits: number[]): number[] => bits.map(b => b == 1 ? 0 : 1)

const createMask = (s: string): Mask => {
    return [...s].reduce((acc, c, idx) => { 
            if (c == "0") acc.zeroes[idx] = 1
            if (c == "1") acc.ones[idx] = 1
            if (c == "X") acc.floats[idx] = 1
            return acc
        }, {zeroes: zeroArray(36), ones: zeroArray(36), floats: zeroArray(36)})
}

const part1 = getLines("input.txt").reduce((acc, line) => {
    if (line.startsWith("mask")) {
        acc.mask = createMask(line.split(" ")[2])
    } else {
        const [addr, val] = line.match(/mem\[(\d+)\] = (\d+)/).slice(1).map(Number)
        const x = bitwiseOperation(not(acc.mask.zeroes), val, AND)
        acc.memory[addr] = bitwiseOperation(acc.mask.ones, x, OR)
    }
    return acc
},{mask: createMask("X"), memory: []})

console.log(`Part 1: ${part1.memory.reduce(R.add)}`)

const generateAddresses = (floating: number[], addr: number): number[] => {
    const totalCount = 2 ** floating.filter(f => f == 1).length
    const floatingAddr = floating.reduce((acc, c, idx) => {
        if (c == 1) {
           acc[idx] = 2 
        }
        return acc
    }, numberToBits(addr))

    const addresses: number[][] = [floatingAddr]
    while (addresses.length < totalCount) {
        const toSplit = addresses.shift()
        const idx = toSplit.findIndex(c => c == 2)
        const first = [...toSplit]
        first[idx] = 0
        const second = [...toSplit]
        second[idx] = 1
        addresses.push(first)
        addresses.push(second)
    }

    return addresses.map(n => n.reverse().reduce((acc, c, idx) => c == 1 ? acc += 2 ** idx : acc, 0))
}

const part2 = getLines("input.txt").reduce((acc, line) => {
    if (line.startsWith("mask")) {
        acc.mask = createMask(line.split(" ")[2])
    } else {
        const [addr, val] = line.match(/mem\[(\d+)\] = (\d+)/).slice(1).map(Number)
        const x = bitwiseOperation(acc.mask.ones, addr, OR)
        const a = generateAddresses(acc.mask.floats, x)
        a.forEach(ad => acc.memory[ad] = val)

    }
    return acc
},{mask: createMask("X"), memory: {} as {[keyof: number]: number}})

console.log(`Part 2: ${Object.values(part2.memory).reduce((acc, x) => acc += BigInt(x), 0n)}`)

 