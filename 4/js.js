import { createReadStream } from 'fs';
import { createInterface } from 'readline';


// common:

async function readLines(path) {
    let lines = [];
    const fileStream = createReadStream(path);
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        lines.push(line);
    }
    return lines;
}

const data = await readLines('data.txt');
const width = data[0].length;
const height = data.length;


// Part 1: How many times does XMAS appear?

function hasMAS(x, y, deltaX, deltaY) {
    return data[x + deltaX][y + deltaY] == 'M' && data[x + 2 * deltaX][y + 2 * deltaY] == 'A' && data[x + 3 * deltaX][y + 3 * deltaY] == 'S'
}

let xmasCount = 0;
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (data[x][y] != 'X') {
            continue;
        }
        if (x < width - 3) {
            xmasCount += hasMAS(x, y, 1, 0);
        }
        if (x > 2) {
            xmasCount += hasMAS(x, y, -1, 0);
        }
        if (y < height - 3) {
            xmasCount += hasMAS(x, y, 0, 1);
        }
        if (y > 2) {
            xmasCount += hasMAS(x, y, 0, -1);
        }
        if (x < width - 3 && y < height - 3) {
            xmasCount += hasMAS(x, y, 1, 1);
        }
        if (x < width - 3 && y > 2) {
            xmasCount += hasMAS(x, y, 1, -1);
        }
        if (x > 2 && y < height - 3) {
            xmasCount += hasMAS(x, y, -1, 1);
        }
        if (x > 2 && y > 2) {
            xmasCount += hasMAS(x, y, -1, -1);
        }
    }
}
console.log(xmasCount);


// Part 2:  it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X.
//          How many times does an X-MAS appear?

function opposite(letter) {
    if (letter == 'M') {
        return 'S';
    }
    if (letter == 'S') {
        return 'M';
    }
    throw letter + " doesn't have opposite";
}

/**
 * @param {Array} arr 
 * @param {Array} elements 
 * @returns {Boolean}
 */
function containsAll(arr, elements) {
    return elements.every(v => arr.includes(v));
}

let xmasCount_2 = 0;
for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
        if (data[x][y] != 'A') {
            continue;
        }
        if (!containsAll(['M', 'S'], [data[x - 1][y - 1], data[x - 1][y + 1], data[x + 1][y - 1], data[x + 1][y + 1]])) {
            continue;
        }
        xmasCount_2 += data[x - 1][y - 1] == opposite(data[x + 1][y + 1]) && data[x + 1][y - 1] == opposite(data[x - 1][y + 1])
    }
}
console.log(xmasCount_2)