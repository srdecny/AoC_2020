import { getLines } from "../utils"
import * as R from "ramda"
import { stat } from "fs"
import { STATUS_CODES } from "http"

enum Op {
    JMP,
    ACC,
    NOP
}

enum Status {
    CYCLED,
    CRASHED,
    RUNNING,
    TERMINATED
}

interface Instruction {
    name: Op
    arg: number
}

interface State {
    acc: number,
    ipc: number,
    status: Status
}

const startingState = {
    acc: 0,
    ipc: 0,
    status: Status.RUNNING
}

const instructions = getLines("input.txt").map(line => {
    const [name, arg] = line.split(" ")
    return {
        name: name == "jmp" ? Op.JMP : name == "acc" ? Op.ACC : Op.NOP,
        arg: Number(arg)
    }
})

const nextState = (i: Instruction[], s: State): State => {
    const instruction = i[s.ipc]
    if (instruction == undefined) {
        return {
            ...s,
            status: s.ipc == i.length ? Status.TERMINATED : Status.CRASHED 
        }
    }
    switch (instruction.name) {
        case Op.ACC:
            return {
                ...s,
                acc: instruction.arg + s.acc,
                ipc: s.ipc + 1,
            }
        case Op.JMP:
            return {
                ...s,
                acc: s.acc,
                ipc: s.ipc + instruction.arg,
            }
        case Op.NOP:
            return {
                ...s,
                acc: s.acc,
                ipc: s.ipc + 1,
            }
    }
}

const runInstructions = (i: Instruction[], s: State = startingState, executed: Set<number> = new Set<number>()): State => {
    const next = nextState(i, s)
    if (next.status == Status.CRASHED || next.status == Status.TERMINATED) return next
    else if (executed.has(next.ipc)) {
        return {
            ...next,
            status: Status.CYCLED
        }
    }
    else return runInstructions(i, next, executed.add(next.ipc))
}

const part1 = runInstructions(instructions, startingState, new Set<number>())
console.log(`Part 1: ${part1.acc}`)

const fixInstructions = (i: Instruction[]): Instruction[][] => {
    return i.reduce((acc, instruction, idx, orig) => {
        switch(instruction.name) {
            case Op.ACC:
                return acc
            case Op.NOP:
            case Op.JMP:
                const fixed = R.clone(orig)
                fixed[idx] = { arg: instruction.arg, name: instruction.name == Op.JMP ? Op.NOP : Op.JMP}
                acc.push(fixed)
                return acc
        }
    }, [] as Instruction[][])
}

const terminating = fixInstructions(instructions).find(i => {
    return runInstructions(i).status == Status.TERMINATED
})

const part2 = runInstructions(terminating)
console.log(`Part 2: ${part2.acc}`)