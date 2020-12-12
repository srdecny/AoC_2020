import { getLines } from "../utils"
import * as R from "ramda"
import { SIGHUP } from "constants";

const direction = ["N", "E", "S", "W"]

interface Ship {
    distanceY: number,
    distanceX: number,
    orientation: typeof direction[number]
}

interface Waypoint {
    waypointX: number,
    waypointY: number
}

type ShipWithWaypoint = Ship & Waypoint
// Proper modulo for negative values
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

const endPoint = getLines("input.txt").reduce((acc: Ship, c: string) => {
    const [action, value] = c.match(/([a-zA-Z]+)(\d+)/).slice(1)
    const numValue = Number(value)
    switch (action) {
        case "N":
            acc.distanceY += numValue
            break
        case "S":
            acc.distanceY -= numValue
            break
        case "E":
            acc.distanceX += numValue
            break
        case "W":
            acc.distanceX -= numValue
            break
        case "L":
            acc.orientation = direction[mod(direction.indexOf(acc.orientation) - numValue / 90, 4)]
            break
        case "R":
            acc.orientation = direction[mod(direction.indexOf(acc.orientation) + numValue / 90, 4)]
            break
        case "F":
            switch (acc.orientation) {
                case "N":
                    acc.distanceY += numValue
                    break
                case "S":
                    acc.distanceY -= numValue
                    break
                case "E":
                    acc.distanceX += numValue
                    break
                case "W":
                    acc.distanceX -= numValue
                    break
            }
            break
    }
    return acc
}, {distanceY: 0, distanceX: 0, orientation: "E"})

const waypointEndpoint = getLines("input.txt").reduce((acc: ShipWithWaypoint, c: string) => {
    const [action, value] = c.match(/([a-zA-Z]+)(\d+)/).slice(1)
    const numValue = Number(value)
    switch (action) {
        case "N":
            acc.waypointY += numValue
            break
        case "S":
            acc.waypointY -= numValue
            break
        case "E":
            acc.waypointX += numValue
            break
        case "W":
            acc.waypointX -= numValue
            break
        case "L":
            const rotateLeft = (ship: ShipWithWaypoint): ShipWithWaypoint => {
                return {
                    ...ship,
                    waypointX: -ship.waypointY,
                    waypointY:ship.waypointX
                }
            }
            return [...Array(numValue / 90).keys()].reduce((rotated, _) => rotateLeft(rotated), acc)
        case "R":
            const rotateRight = (ship: ShipWithWaypoint): ShipWithWaypoint => {
                return {
                    ...ship,
                    waypointX: ship.waypointY,
                    waypointY: -ship.waypointX
                }
            }
            return [...Array(numValue / 90).keys()].reduce((rotated, _) => rotateRight(rotated), acc)
        case "F":
          acc.distanceX += acc.waypointX * numValue
          acc.distanceY += acc.waypointY * numValue
          break 
    }
    console.log(acc)
    return acc
}, {distanceY: 0, distanceX: 0, orientation: "E", waypointX: 10, waypointY: 1})

console.log(`Part 1: ${Math.abs(endPoint.distanceX) + Math.abs(endPoint.distanceY)}`)
console.log(`Part 2: ${Math.abs(waypointEndpoint.distanceX) + Math.abs(waypointEndpoint.distanceY)}`)
