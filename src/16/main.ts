import { getLines } from "../utils"
import * as R from "ramda"

const blocks = getLines("input.txt")
const ruleStrings = blocks.slice(0, 20)
const myTicket = blocks[22].split(",").map(Number)
const nearbyTickets = blocks.slice(25)

type Rule = (n: number) => boolean
const createRule = (s: string): Rule => {
    const [from1, to1, from2, to2] = s.match(/(\d+)-(\d+) or (\d+)-(\d+)/).slice(1).map(Number)
    return (n) => (from1 <= n && to1 >= n) || (from2 <= n && to2 >= n)
}

const rules = ruleStrings.map(createRule)
const errorRate = nearbyTickets.flatMap(x => x.split(",").map(Number))
    .filter(field => rules.map(r => r(field)).filter(x => x).length == 0)
    .reduce(R.add)
console.log(`Part 1: ${errorRate}`)

const validTickets = nearbyTickets.map(l => l.split(",").map(Number))
        .filter(fields => !fields.some(field => rules.map(r => r(field)).filter(r => r).length == 0))

const fields = R.transpose(validTickets)
type Constraints = {[keyof: number]: number[]}
const constraints = fields.reduce((constr, field, idx) => {
    const satisfiedRules = rules.reduce((sat, rule, ruleIdx) => {
        if (!field.some(f => !rule(f))) {
            sat.push(ruleIdx)
        }
        return sat
    }, [] as number[])
    constr[idx] = satisfiedRules
    return constr
}, {} as Constraints)

const solved = Object.entries(constraints).reduce((acc, _, __, orig) => {
    const diff = (a: number[], b: number[]) => a.filter(x => b.indexOf(x) < 0)
    const [f, r] = orig.find(([fieldIdx, ruleIdxs]) => diff(ruleIdxs, [...acc.matched]).length == 1)
    acc.found[r.find(r => !acc.matched.has(r))] = Number(f)
    r.forEach(found => acc.matched.add(found))
    return acc
}, {
    matched: new Set<number>(),
    found: {} as {[keyof: number]: number}

})

const departureFields = [...Array(6).keys()].map(ruleKey => myTicket[solved.found[ruleKey]])
console.log(`Part 2: ${departureFields.reduce(R.multiply)}`)