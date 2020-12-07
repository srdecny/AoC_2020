 import { getLines } from "../utils"
import * as R from "ramda"

interface Rules {
    [key: string]: {
        name: string
        count: number
    }[]
}

const rules = getLines("input.txt").reduce((acc, line) => {
    const [head, tail] = line.split("contain")
    const [name] = head.match(/(\w+ \w+)/).slice(1)
    const contains = tail.split(",").reduce((acc, c) => {
        if (c.includes("no other")) return acc
        const [count, name] = c.trim().match(/(\d+) (\w+ \w+)/).slice(1)
        acc.push({
            name: name,
            count: Number(count) 
        })
        return acc
    }, [] as Rules[keyof Rules])

    acc[name] = contains
    return acc
}, {} as Rules) 


const findCanContain = (bagName: string): string[] => {
    const canContain = Object.keys(rules).filter((name) => rules[name].some(r => r.name == bagName))
    if (canContain.length == 0) return [bagName]
    else return canContain.reduce((acc, n) => acc.concat(findCanContain(n)), [bagName])
}

const canContainShinyGold = [...new Set(findCanContain("shiny gold"))].length - 1
console.log(`Part 1: ${canContainShinyGold}`)

const containsHowMany = (bagName: string): number => {
    return rules[bagName].reduce((acc, c) => {
        return acc += c.count + c.count * containsHowMany(c.name)
    }, 0)
}
console.log(`Part 2: ${containsHowMany("shiny gold")}`)