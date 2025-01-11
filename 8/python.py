from math import gcd


# common:

with open('data.txt') as file:
    lines = file.read().splitlines()
width = len(lines[0])
height = len(lines)


# part 1:

def add_antipods(pos, ch):
    for existing_antenna in antenna_positions[ch]:
        deltaX = pos[0] - existing_antenna[0]
        deltaY = pos[1] - existing_antenna[1]
        antipod_1 = (pos[0] + deltaX, pos[1] + deltaY)
        antipod_2 = (pos[0] - 2 * deltaX, pos[1] - 2 * deltaY)
        if antipod_1[0] >= 0 and antipod_1[0] < width and antipod_1[1] >= 0 and antipod_1[1] < height:
            antipod_positions.add(antipod_1)
        if antipod_2[0] >= 0 and antipod_2[0] < width and antipod_2[1] >= 0 and antipod_2[1] < height:
            antipod_positions.add(antipod_2)


# part 2:

def add_antipods_2(pos, ch):
    for existing_antenna in antenna_positions[ch]:
        deltaX = pos[0] - existing_antenna[0]
        deltaY = pos[1] - existing_antenna[1]
        divisor = gcd(deltaX, deltaY)
        deltaX /= divisor
        deltaY /= divisor
        current_pos = pos
        while current_pos[0] >= 0 and current_pos[0] < width and current_pos[1] >= 0 and current_pos[1] < height:
            antipod_positions_2.add(current_pos)
            current_pos = (current_pos[0] + deltaX, current_pos[1] + deltaY)
        current_pos = pos
        while current_pos[0] >= 0 and current_pos[0] < width and current_pos[1] >= 0 and current_pos[1] < height:
            antipod_positions_2.add(current_pos)
            current_pos = (current_pos[0] - deltaX, current_pos[1] - deltaY)


# doing both parts simultaneously
antenna_positions = {}
antipod_positions = set()
antipod_positions_2 = set()
y = -1
for line in lines:
    y += 1
    x = -1
    for ch in line:
        x += 1
        if ch == '.':
            continue
        if ch in antenna_positions:
            add_antipods((x,y), ch)
            add_antipods_2((x,y), ch)
            antenna_positions[ch].append((x, y))
        else:
            antenna_positions[ch] = [(x, y)]
print(len(antipod_positions))
print(len(antipod_positions_2))