import fs from 'node:fs';

// reading: 

const data = fs.readFileSync('data.txt', 'utf8').split('\n');
const width = data[0].length;
const height = data.length;


// common:

function findNeighbors(pos, neighbor) {
    const { x, y } = pos;
    let positions = [];
    if (x > 0 && data[y][x - 1] == neighbor) {
        positions.push({ x: x - 1, y });
    }
    if (x < width - 1 && data[y][x + 1] == neighbor) {
        positions.push({ x: x + 1, y });
    }
    if (y > 0 && data[y - 1][x] == neighbor) {
        positions.push({ x, y: y - 1 });
    }
    if (y < height - 1 && data[y + 1][x] == neighbor) {
        positions.push({ x, y: y + 1 });
    }
    return positions;
}

function addUniquePosition(arr, pos) {
    for (let el of arr) {
        if (el.x == pos.x && el.y == pos.y) {
            return el;
        }
    }
    arr.push(pos);
    return pos;
}

// Part 1:

let totalScore = 0;
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (data[y][x] != '0') {
            continue;
        }
        let positions = [{ x, y }];
        for (let target = 1; target < 10; target++) {
            let nextPositions = [];
            for (let pos of positions) {
                for (let newPos of findNeighbors(pos, target.toString())) {
                    addUniquePosition(nextPositions, newPos);
                }
            }
            positions = nextPositions;
            if (nextPositions.length === 0) {
                break;
            }
            if (target == 9) {
                totalScore += nextPositions.length;
            }
        }
    }
}
console.log(totalScore);


// Part 2:

function sum(arr) {
    return arr.reduce((a, b) => a + b)
}

totalScore = 0;
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (data[y][x] != '0') {
            continue;
        }
        let positions = [{ x, y, paths: 1 }];
        for (let target = 1; target < 10; target++) {
            let nextPositions = [];
            for (let pos of positions) {
                for (let newPos of findNeighbors(pos, target.toString())) {
                    let actualPos = addUniquePosition(nextPositions, newPos);
                    actualPos.paths ??= 0
                    actualPos.paths += pos.paths;
                }
            }
            positions = nextPositions;
            if (nextPositions.length === 0) {
                break;
            }
            if (target == 9) {
                totalScore += sum(nextPositions.map(p => p.paths));
            }
        }
    }
}
console.log(totalScore);