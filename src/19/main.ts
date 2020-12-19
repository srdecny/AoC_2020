import { getLines } from "../utils"
import * as R from "ramda"

const lines = getLines("input.txt")
const rawRules = lines.splice(0, lines.findIndex(l => l == ""))
const messages = lines.splice(lines.findIndex(l => l == "") + 1)

type Rules = {[keyof: string]: string}

const resolveRule = (ruleIdx: string, rules: Rules): string => {
    if (rules[ruleIdx]) return rules[ruleIdx]

    const [id, rest] = rawRules.find(r => r.startsWith(`${ruleIdx}: `)).match(/(\d+): (.*)/).splice(1)
    
    if (rest.startsWith("\"")) {
        rules[id] = rest.replace(/"/g, "")
        return rules[id]
    }

    const groups = rest.split("|").map(g => g.trim().split(" "))
    var rule = "(" + groups.map(group => {
        return "(" + group.map(id => resolveRule(id, rules)).join("") + ")"
    }).join("|") + ")"

    // Part 2
    if (id == "8") rule += "+"
    if (id == "11") {
        const left = resolveRule("42", rules)
        const right = resolveRule("31", rules)
        rule = "(" + [...Array(10).keys()].reduce((acc, n) => {
            if (n > 0) {
                acc.push(`((${left}){${n}}(${right}){${n}})`)
            }
            return acc
        }, []).join("|") + ")"
    }

    rules[id] = rule
    return rules[id]

}

const resolvedRules = rawRules.reduce((acc, c) => {
    const [ruleIdx] = c.match(/^(\d+)/).splice(1)
    resolveRule(ruleIdx, acc)
    return acc
}, {} as Rules)

const ruleZero = new RegExp("^" + resolvedRules["0"] + "$")
const part1 = messages.filter(m => ruleZero.test(m)).length
console.log(`Part 1: ${part1}`)