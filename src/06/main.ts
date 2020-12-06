import { getLines } from "../utils"
import * as R from "ramda"

const groups: string[] = getLines("input.txt").concat("").reduce((acc, c) => {
    if (c.length == 0) {
        acc.grps.push(acc.g)
        acc.g = ""
    } else {
        acc.g += c
    }
    return acc
},  {
    grps: [],
    g: ""
} as any).grps


const part1 = groups.reduce((acc: number, group) => {
    return acc += [..."abcdefghijklmnopqrstuvwxyz"].filter(char => RegExp(`${char}`).test(group)).length
}, 0)

console.log(`Part 1: ${part1}`)


    
const alternativeGroups: string[][] = getLines("input.txt").concat("").reduce((acc, c) => {
    if (c.length == 0) {
        acc.grps.push(acc.g)
        acc.g = []
    } else {
        acc.g.push(c)
    }
    return acc
},  {
    grps: [],
    g: []
} as any).grps


const part2 = alternativeGroups.reduce((acc: number, group: string[]) => {
    return acc += [..."abcdefghijklmnopqrstuvwxyz"].filter(char => {
        return R.all(g => RegExp(`${char}`).test(g), group)
    }).length
}, 0)
console.log(`Part 2: ${part2}`)
