import { getLines } from "../utils"
import * as R from "ramda"

interface passwordRecord {
    min: number,
    max: number,
    char: string,
    password: string
}

const input = getLines("input.txt")

const parser = (line: string): passwordRecord => {
    const [interval, character, password] = line.split(" ")
    const [min, max] = interval.split("-").map(Number)
    return {
        min: min,
        max: max,
        char: character.replace(":", ""),
        password: password
    }
}

const regexMaker = (min: number, max: number, char: string): RegExp => {
    return RegExp(`^(?:[^${char}]*${char}[^${char}]*){${min},${max}}$`)
}

const part1 = input.map(parser).reduce((acc: string[], curr: passwordRecord) => {
    if (regexMaker(curr.min, curr.max, curr.char).test(curr.password)) {
        acc.push(curr.password)
    }
    return acc 
}, []).length

console.log(part1)
console.log(`Part 1: ${part1}`)


const part2 = input.map(parser).reduce((acc: string[], curr: passwordRecord) => {
    if (regexMaker(1, 1, curr.char).test(curr.password[curr.min - 1] + curr.password[curr.max - 1])) {
        acc.push(curr.password)
    }
    return acc 
}, []).length

console.log(part2)
console.log(`Part 2: ${part2}`)