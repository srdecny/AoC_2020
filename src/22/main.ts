import { getLines } from "../utils"
import * as R from "ramda"

const lines = getLines("input.txt")

const delimiter = lines.findIndex(x => x == "")
const deck1 = lines.slice(1, delimiter).map(Number)
const deck2 = lines.slice(delimiter + 2).map(Number)

const score = (deck: number[]) => deck.reverse().reduce((acc, c, idx) => acc += c * (idx + 1), 0)

const combat = (deck1: number[], deck2: number[]): number => {
    while (deck1.length != 0 && deck2.length != 0) {
        const [first, second] = [deck1, deck2].map(d => d.shift())
        if (first > second) {
            deck1.push(first)
            deck1.push(second)
        } else {
            deck2.push(second)
            deck2.push(first)
        }
    }

    return Math.max(...[deck1, deck2].map(score)) 
}
console.log(`Part 1: ${combat([...deck1], [...deck2])}`)

const recursiveCombat = (deck1: number[], deck2: number[], game: number): any => {
    const seenConfigurations = new Set<string>()
    while (deck1.length != 0 && deck2.length != 0) {
        const config = deck1.join(",") + "|" + deck2.join(",")
        if (seenConfigurations.has(config)) {
            return game == 1 ? score(deck1) : true
        }
        seenConfigurations.add(config)

        const [card1, card2] = [deck1, deck2].map(d => d.shift())

        var didFirstWin = false
        if (card1 <= deck1.length && card2 <= deck2.length) {
            didFirstWin = recursiveCombat([...deck1.slice(0, card1)], [...deck2.slice(0, card2)], game + 1)
        } else {
            didFirstWin = card1 > card2
        }

        if (didFirstWin) {
            deck1.push(card1)
            deck1.push(card2)
        } else {
            deck2.push(card2)
            deck2.push(card1)
        }
    }
    if (game == 1) return Math.max(...[deck1, deck2].map(score))
    return deck1.length > 0
}
console.time("a")
console.log(`Part 2: ${recursiveCombat([...deck1], [...deck2], 1)}`)
console.timeEnd("a")