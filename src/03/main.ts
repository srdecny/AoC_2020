import { getLines } from "../utils"
import * as R from "ramda"

enum GridObjects {
    TREE,
    EMPTY
}

class Grid<T> {
    grid: [T[]] = [[]]
    public maxX = 0
    public maxY =  0
    get = (x: number, y: number): T => {
        return this.grid[y][x % (this.maxX)]
    } 
}

const grid: Grid<GridObjects> = getLines("input.txt").reduce((acc: Grid<GridObjects>, line: string, idx: number) => {
    acc.grid[idx] = [...line].map(c => c == "." ? GridObjects.EMPTY : GridObjects.TREE)
    acc.maxY += 1
    acc.maxX = line.length
    return acc
}, new Grid<GridObjects>())

console.log(grid)
const part1 = R.range(0, grid.maxY).map(i => grid.get(3*i, i)).filter(R.equals(GridObjects.TREE)).length
console.log(`Part 1: ${part1}`)

const funcs: { (y: number): [number, number] }[] = [
    (y) => { return [y, y] }, // Right 1, down 1
    (y) => { return [3*y, y] }, // Right 3, down 1
    (y) => { return [5*y, y] },
    (y) => { return [7*y, y] },
    (y) => { return [y, 2*y] }
]
const part2 = funcs.map(func => R.range(0, grid.maxY).map(i => func(i))
        .filter(([_, y]) => y <= grid.maxY)
        .map(([x, y]) => grid.get(x, y))
        .filter(R.equals(GridObjects.TREE))
        .length).reduce(R.multiply)
console.log(`Part 2: ${part2}`)