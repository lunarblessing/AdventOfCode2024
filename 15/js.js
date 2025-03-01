import { createReadStream } from 'fs';
import { createInterface } from 'readline';

async function readLines(path, doubleSize) {
    const multiplier = doubleSize ? 2 : 1;
    const map = [];
    const moves = [];
    let isCompletingMap = true;
    let playerX, playerY;
    const fileStream = createReadStream(path);
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let i = 0;
    for await (let line of rl) {
        const mapLine = [];
        if (line.length === 0) {
            isCompletingMap = false;
        }
        else if (isCompletingMap) {
            for (let ch of line) {
                if (ch == '@') {
                    playerX = line.indexOf('@') * multiplier;
                    playerY = i;
                    mapLine.push('.');
                    if (doubleSize) {
                        mapLine.push('.');
                    }
                }
                else if (ch == 'O' && doubleSize) {
                    mapLine.push('[');
                    mapLine.push(']');
                }
                else {
                    mapLine.push(ch);
                    if (doubleSize) {
                        mapLine.push(ch);
                    }
                }
            }
            map.push(mapLine);
        }
        else {
            moves.push(...line)
        }
        i++;
    }
    return [map, moves, playerX, playerY];
}

async function process(doubleSize) {
    let [map, moves, playerX, playerY] = await readLines('data.txt', doubleSize);

    const directions = new Map();
    directions["^"] = [0, -1];
    directions[">"] = [1, 0];
    directions["<"] = [-1, 0];
    directions["v"] = [0, 1];

    // only for part 2 where boxes are 2 chars wide
    function boxCanBePushed(x, y, dirX, dirY) {
        if (dirX) { // moving horizontally
            if (dirX == 1 && map[y][x] == "[") {
                x += 1;
            }
            else if (dirX == -1 && map[y][x] == "]") {
                x -= 1;
            }
            if (map[y][x + dirX] == ".") {
                return true;
            }
            if (map[y][x + dirX] == "#") {
                return false;
            }
            return boxCanBePushed(x + dirX, y, dirX, dirY);
        }
        else { // moving vertically
            const xLeft = map[y][x] == "[" ? x : x - 1;
            const xRight = map[y][x] == "]" ? x : x + 1;
            if (map[y + dirY][xLeft] == "." && map[y + dirY][xRight] == ".") {
                return true;
            }
            if (map[y + dirY][xLeft] == "#" || map[y + dirY][xRight] == "#") {
                return false;
            }
            // at this point we have either 2 box cells next, or 1 box cell and 1 empty cell
            if (map[y + dirY][xLeft] == "." || map[y + dirY][xLeft] == "[") {
                return boxCanBePushed(xRight, y + dirY, dirX, dirY);
            }
            else if (map[y + dirY][xRight] == ".") {
                return boxCanBePushed(xLeft, y + dirY, dirX, dirY);
            }
            // 2 different boxes next
            return boxCanBePushed(xLeft, y + dirY, dirX, dirY) && boxCanBePushed(xRight, y + dirY, dirX, dirY);
        }
    }

    // only for part 2 where boxes are 2 chars wide
    function pushBoxes(x, y, dirX, dirY) {
        if (dirX) {
            map[y][x] = '.'
            let curX = x + dirX;
            while (map[y][curX] != '.') {
                map[y][curX] = map[y][curX] == '[' ? ']' : '[';
                curX += dirX;
            }
            map[y][curX] = dirX == 1 ? "]" : "["
        }
        else {
            const xLeft = map[y][x] == "[" ? x : x - 1;
            const xRight = map[y][x] == "]" ? x : x + 1;
            if (map[y + dirY][xLeft] != "." || map[y + dirY][xRight] != ".") {
                if (map[y + dirY][xLeft] == "." || map[y + dirY][xLeft] == "[") {
                    pushBoxes(xRight, y + dirY, dirX, dirY);
                }
                else if (map[y + dirY][xRight] == ".") {
                    pushBoxes(xLeft, y + dirY, dirX, dirY);
                }
                else { // 2 different boxes
                    pushBoxes(xLeft, y + dirY, dirX, dirY);
                    pushBoxes(xRight, y + dirY, dirX, dirY);
                }
            }
            map[y + dirY][xLeft] = "[";
            map[y + dirY][xRight] = "]";
            map[y][xLeft] = "."
            map[y][xRight] = "."
        }
    }

    function tryMove(x, y, dirX, dirY, doubleSize) {
        if (map[y + dirY][x + dirX] == ".") {
            return true;
        }
        if (map[y + dirY][x + dirX] == "#") {
            return false;
        }
        // reached box
        if (doubleSize) {
            if (boxCanBePushed(x + dirX, y + dirY, dirX, dirY)) {
                pushBoxes(x + dirX, y + dirY, dirX, dirY);
                return true
            }
            return false
        }
        else {
            let i = 2;
            // find the end of span of boxes
            while (map[y + dirY * i][x + dirX * i] == "O") {
                i++;
            }
            if (map[y + dirY * i][x + dirX * i] == ".") { // we can push boxes
                map[y + dirY][x + dirX] = "."; // push first box away
                map[y + dirY * i][x + dirX * i] = "O" // push last box
                // cells in between don't need to be updated as they'll stay as boxes
                return true;
            }
            else { // stuck on wall
                return false;
            }
        }
    }

    for (let move of moves) {
        const [dirX, dirY] = directions[move];
        const canMove = tryMove(playerX, playerY, dirX, dirY, doubleSize);
        if (canMove) {
            playerX += dirX;
            playerY += dirY;
        }
    }

    let sum = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] == "O" || map[y][x] == "[") {
                sum += y * 100 + x;
            }
        }
    }
    console.log(sum);
}

await process(false)
await process(true)