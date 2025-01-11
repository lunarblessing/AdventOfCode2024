import fs from 'node:fs';

// Reading data
let stream = fs.createReadStream('data.txt', { encoding: 'utf-8' });
let currentIndex = 0;
let ranges = [];
let freeRanges = [];
let isFreeRangeNext = false;
let blockId = 0;
stream.on('data', (data) => {
    for (let char of data) {
        let digit = char - '0';
        if (isFreeRangeNext) {
            if (digit > 0) {
                freeRanges.push({ start: currentIndex, end: currentIndex + digit });
            }
        }
        else {
            if (digit > 0) {
                ranges.push({ val: blockId, start: currentIndex, end: currentIndex + digit });
            }
            blockId++;
        }
        currentIndex += digit;
        isFreeRangeNext = !isFreeRangeNext;
    }
});
stream.on('end', () => {
    processData();
});


function processData() {
    let checksum = 0;
    let finished = false;
    for (let freeRange of freeRanges) {
        if (finished) {
            break;
        }
        while (true) {
            let range = ranges.pop()
            if (range.start < freeRange.start) {
                finished = true;
                ranges.push(range); // restore
                break;
            }
            let length = range.end - range.start;
            if (length <= freeRange.end - freeRange.start) { // fits fully in current free space
                // add checksum
                for (let n = freeRange.start; n < freeRange.start + length; n++) {
                    checksum += n * range.val;
                }
                freeRange.start += length;
            }
            else { // doesn't fit in current free space
                range.end -= (freeRange.end - freeRange.start)
                ranges.push(range) // push it back, but it is shorter this time
                // add checksum
                for (let n = freeRange.start; n < freeRange.end; n++) {
                    checksum += n * range.val
                }
                break;
            }
            if (freeRange.end == freeRange.start) {
                break; // if last block had a perfect fit with free space
            }
        }
    }
    // calculate blocks that weren't moved
    for (let remainingBlock of ranges) {
        for (let n = remainingBlock.start; n < remainingBlock.end; n++) {
            checksum += n * remainingBlock.val;
        }
    }
    console.log(checksum)
}