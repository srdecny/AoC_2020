import { getLines } from "../utils"
import * as R from "ramda"

interface Food {
    ingredients: string[]
    allergens: string[]
}

const foods = getLines("input.txt").reduce((acc, c) => {
    const [ingredients, allergens] = c.split("(contains ") 
    acc.push({
        ingredients: ingredients.trim().split(" "),
        allergens: allergens.replace(/[),]/g, "").trim().split(" ")
    })
    return acc
}, [] as Food[])

const allIngredients = new Set<string>(foods.flatMap(f => f.ingredients))
const allAllergens = new Set<string>(foods.flatMap(f => f.allergens))

const possibilities = [...allAllergens].reduce((acc, allergen) => {
    const ingredients = foods.filter(f => f.allergens.includes(allergen)).map(f => f.ingredients)
    while (ingredients.length > 1) {
        ingredients.push(R.intersection(ingredients.pop(), ingredients.pop()))
    }
    acc[allergen] = new Set<string>(ingredients.pop())
    return acc
}, {} as {[keyof: string]: Set<string>})


const possibleAllergens = Object.values(possibilities).reduce((acc, c) => {
    return acc.concat(...c)
}, [])

const clearIngredients = R.difference([...allIngredients], [...possibleAllergens])
const clearCount = foods.reduce((acc, c) => acc += R.intersection(c.ingredients, clearIngredients).length, 0)
console.log(`Part 1: ${clearCount}`)

const matchedAllergens = Object.entries(possibilities).reduce((acc, _, __, orig) => {
    const [name, ingredient] = orig.find(o => o[1].size == 1)
    const i = [...ingredient][0]
    acc[name] = [...ingredient][0]
    orig.forEach(o => o[1].delete(i))
    return acc
}, {} as {[keyof: string]: string})


const ingredientList = Object.entries(matchedAllergens)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .flatMap(l => l[1])
        .join(",")

console.log(`Part 2: ${ingredientList}`)