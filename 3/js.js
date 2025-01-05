import fs from 'node:fs';


// common:

/**
 * @param {string} str 
 * @returns {Array<number>[2]}
 */
function parseMul(str) {
    let commaIndex = str.indexOf(',');
    return [parseInt(str.slice(4, commaIndex)), parseInt(str.slice(commaIndex + 1, -1))];
}

const data = fs.readFileSync('data.txt', 'utf8');


// Part 1: What do you get if you add up all of the results of the multiplications?

const re = /mul\(\d{1,3},\d{1,3}\)/g;
let sum = 0;
for (let match of data.matchAll(re)) {
    let [a, b] = parseMul(match[0]);
    sum += a * b;
}
console.log(sum);


// Part 2:  Only the most recent do() or don't() instruction applies.
//          What do you get if you add up all of the results of just the enabled multiplications?

// group 1 is mul, group 2 is do(), group 3 is don't()
const re_2 = /(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g;
let sum_2 = 0;
let enabled = true;
for (let match of data.matchAll(re_2)) {
    if (match[2]) {
        enabled  = true;
    }
    else if (match[3]) {
        enabled = false;
    }
    else if (enabled) {
        let [a, b] = parseMul(match[1]);
        sum_2 += a * b;
    }
}
console.log(sum_2)
