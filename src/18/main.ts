import { getLines } from "../utils"

// Download Node from GitHub
// Change the multiplication token priority in /deps/v8/src/parsing/token.h
// so that it has the same priority as addition.
// Compile and execute with the modified binary.


// ⋊> ~/r/node on master ⨯ ./node                                                                                                                                                                                                                                           09:53:40
// Welcome to Node.js v16.0.0-pre.
// Type ".help" for more information.
// > 1 + 2 * 3
// 9

const lines = getLines("input.txt")
const part1 = lines.reduce((acc, c) => acc += Number(eval(c)), 0)
console.log(`Part 1: ${part1}`)

// For part 2, hange the addition token priority so it's larger than for multiplication.
