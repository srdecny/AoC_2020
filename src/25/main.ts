var loop = 0
var number = 1n


// 9033205 => 13467729
// 9281649 => 3020524

while (true) {
    loop++
    number *= 7n
    number = number % 20201227n
    if (number == 9281649n) {
        console.log(loop)
        break
    }
}

// https://www.wolframalpha.com/input/?i=9281649%5E13467729+mod+20201227+