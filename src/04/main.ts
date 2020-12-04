import { getLines } from "../utils"
import * as R from "ramda"

const passports = getLines("input.txt").concat("").reduce((acc, line) => {
    if (line.length == 0) {
        acc.passports.push(acc.processed)
        acc.processed = {}
        return acc
    } else {
        const fields = line.split(" ").map(f => f.split(":"))
        fields.forEach(([name, value]) => acc.processed[name] = value)
    }
    return acc
}, {passports: [], processed: {} as any}).passports

const part1 = passports.filter(p => Object.keys(p).length == 8 || (Object.keys(p).length == 7 && !p["cid"])).length
console.log(`Part 1: ${part1}`)

const isInRange = (min: number, max: number, s: string): boolean => { const n = Number(s); return max >= n && n >= min }
const isHeightValid = (h: string): boolean => {
    const matches = h.match(/(\d+)(cm|in)/)
    if (!matches) return false
    const [val, unit] = matches.slice(1) 
    if (!unit) return false
    else if (unit == "cm") return isInRange(150, 193, val)
    else return isInRange(59, 76, val)
}
const part2 = passports.filter(p => { 
    console.log(p)
    return isInRange(1920, 2002, p["byr"]) &&
    isInRange(2010, 2020, p["iyr"]) &&
    isInRange(2020, 2030, p["eyr"]) &&
    isHeightValid(p["hgt"] ?? "") &&
    /^#[0-9a-f]{6}$/.test(p["hcl"]) &&
    /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(p["ecl"]) &&
    /^\d{9}$/.test(p["pid"])
}).length

console.log(`Part 2: ${part2}`)