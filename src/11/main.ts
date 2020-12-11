import { getLines } from "../utils"
import * as R from "ramda"

enum Obj {
    FLOOR,
    EMPTY,
    TAKEN
}

type Layout = Obj[][]

const layout: Layout = getLines("input.txt").reduce((acc, c) => {
    return acc.concat([[...c].map(o => o == "." ? Obj.FLOOR : o == "L" ? Obj.EMPTY : Obj.TAKEN)])
}, [])

const getObj = (l: Layout, x: number, y: number): Obj | undefined => {
    return l[y]?.[x] 
}


type getVisibleSeats = (_: Layout, _: number, _: number) => Obj[]
const getNeighbours = (l: Layout, x: number, y: number): Obj[] => {
    return [-1, 0, 1].flatMap(newX => [-1, 0, 1].map(newY => [newX, newY]))
            .filter(([x, y]) => x != 0 || y != 0)
            .map(([Dx, Dy]) => getObj(l, x + Dx, y + Dy))
            .filter(o => o)
}

const getFirstVisible = (l: Layout, x: number, y: number): Obj[] => {
    return [-1, 0, 1].flatMap(newX => [-1, 0, 1].map(newY => [newX, newY]))
            .filter(([x, y]) => x != 0 || y != 0)
            .map(([Dx, Dy]) => {
                var counter = 1
                while (true) {
                    var visible = getObj(l, x + (Dx * counter), y + (Dy * counter))
                    if (visible == undefined) return undefined
                    else if (visible == Obj.FLOOR) {
                        counter += 1
                    }
                    else return visible
                }
            })
            .filter(o => o)
}

type Rules = (c: Obj, v: Obj[]) => Obj
const pt1Rules = (curr: Obj, visible: Obj[]): Obj => {
        const occupiedCount = visible.filter(x => x == Obj.TAKEN).length
        if (curr == Obj.EMPTY && occupiedCount == 0) return Obj.TAKEN
        if (curr == Obj.TAKEN && occupiedCount >= 4) return Obj.EMPTY
        return curr
}

const pt2Rules = (curr: Obj, visible: Obj[]): Obj => {
        const occupiedCount = visible.filter(x => x == Obj.TAKEN).length
        if (curr == Obj.EMPTY && occupiedCount == 0) return Obj.TAKEN
        if (curr == Obj.TAKEN && occupiedCount >= 5) return Obj.EMPTY
        return curr
}

const toString = (l: Layout) => l.flatMap(o => o.toString()).join("")
const print = (l: Layout) => console.log(l.map(line => line.map(c => c == Obj.EMPTY ? "L" : c == Obj.FLOOR ? "." : "#").join("")).join("\n"))

const nextTick = (l: Layout, visible: getVisibleSeats, rules: Rules): Layout => {
    return l.map((line, y) => line.map((obj, x) => {
       return rules(obj, visible(l, x, y))
    }))
}

const findStableLayout = (init: Layout, visible: getVisibleSeats, rules: Rules): Layout => {
    var prevToString = toString(init)
    var next = nextTick(init, visible, rules)

    while(prevToString != toString(next)) {
        prevToString = toString(next)
        next = nextTick(next, visible, rules)
    }
    return next
}


const stable = findStableLayout(layout, getNeighbours, pt1Rules)
const occupiedCount = stable.flat().filter(o => o == Obj.TAKEN).length
console.log(`Part 1: ${occupiedCount}`)

const stable2 = findStableLayout(layout, getFirstVisible, pt2Rules)
const occupiedCount2 = stable2.flat().filter(o => o == Obj.TAKEN).length
console.log(`Part 2: ${occupiedCount2}`)