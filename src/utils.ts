import { readFileSync } from "fs";

export function getLines(path: string, delimiter: string = "\n") {
    return readFileSync(path, "utf8").trim().split(delimiter);
}
