import fs from 'node:fs';

// reading data is copy of part 1
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
    let currentIndex = ranges.length - 1;
    while (currentIndex >= 0) {
        let range = ranges[currentIndex]
        let length = range.end - range.start
        for (let freeRange of freeRanges) {
            if (freeRange.start > range.start) {
                break;
            }
            if (freeRange.end - freeRange.start < length) {
                continue;
            }
            for (let n = freeRange.start; n < freeRange.start + length; n++) {
                checksum += n * range.val;
            }
            ranges[currentIndex] = null; // remove it so it won't get counted later
            freeRange.start += length;
            break;
        }
        currentIndex--;
    }
    // calculate blocks that weren't moved
    for (let remainingBlock of ranges) {
        if (remainingBlock) {
            for (let n = remainingBlock.start; n < remainingBlock.end; n++) {
                checksum += n * remainingBlock.val;
            }
        }
    }
    console.log(checksum);
}