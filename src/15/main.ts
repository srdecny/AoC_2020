import { getLines } from "../utils"
import * as R from "ramda"


interface Game {
    turn: number,
    last: number
    spoken: {
        [keyof: number]: number[]
    }
}

const testinput = "0,3,6".split(",").map(Number)
const input = "7,14,0,17,11,1,2".split(",").map(Number)


const gameStart = (): Game => { 
    return input.reduce((acc, c) => {
        acc.turn += 1
        acc.spoken[c] = [acc.turn]
        acc.last = c
        return acc
    }, {turn: 0, last: -1, spoken: {}} as Game)
}


const addSpoken = (n: number, turn: number, g: Game): Game => {
    if (!g.spoken[n]) {
        g.spoken[n] = [turn]
    } else {
        if (g.spoken[n].push(turn) > 2) {
            g.spoken[n].shift()
        }
    }
    return g
}

const nextRound = (g: Game): Game => {
    g.turn += 1

    if (!g.spoken[g.last] || g.spoken[g.last].length < 2) {
        g.last = 0
    } else {
        g.last = Math.abs(g.spoken[g.last].reduce(R.subtract))
    }
    return addSpoken(g.last, g.turn, g)

}

var game = gameStart()
while (game.turn != 30_000_000) {
    game = nextRound(game)
}
console.log(`Part 1: ${game.last}`)


const gameToString = (g: Game): string => {
    const spokenAsString = JSON.stringify(Object.entries(g.spoken).sort((a, b) => Number(a[0]) - Number(b[0])))
    return `${g.spoken.toString()}|${spokenAsString}`
}

var game2 = gameStart()
const states: {[keyof: string]: number} = {}
while (true) {
    const s = gameToString(game2)
    if (states[s]) {
        console.log("found repeating")
        break
    } else {
        states[s] = game2.turn
        game2 = nextRound(game2)
    }
    if (Object.keys(states).length % 1000 == 0){
        console.log("aaa")
    }
}