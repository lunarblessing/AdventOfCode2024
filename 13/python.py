equations = []

with open('data.txt') as file:
    cur_equation = []
    for line in file.readlines():
        if line.startswith('Button A'):
            cur_equation.append(int(line[line.index('X') + 2: line.index(',')]))
            cur_equation.append(int(line[line.index('Y') + 2:]))
        elif line.startswith('Button B'):
            cur_equation.append(int(line[line.index('X') + 2: line.index(',')]))
            cur_equation.append(int(line[line.index('Y') + 2:]))
        elif line.startswith('Prize'):
            cur_equation.append(int(line[line.index('X') + 2: line.index(',')]))
            cur_equation.append(int(line[line.index('Y') + 2:]))
            equations.append(cur_equation)
        else:
            cur_equation = []


# Part 1

total = 0
for equation in equations: # solving linear system of 2 equations
    r = (equation[0] + equation[1]) / equation[0]
    bcount = equation[2] + equation[3] - equation[2] * r
    s = equation[4] + equation[5] - equation[4] * r
    b = s / bcount
    if abs(b - round(b)) < 0.000001:
        a = round((equation[4] - equation[2] * b) / equation[0])
        b = round(b)
        total += 3 * a + b
print(total)


# Part 2:

total = 0
for equation in equations: # solving linear system of 2 equations
    equation[4] += 10000000000000
    equation[5] += 10000000000000
    r = (equation[0] + equation[1]) / equation[0]
    bcount = equation[2] + equation[3] - equation[2] * r
    s = equation[4] + equation[5] - equation[4] * r
    b = s / bcount
    a = round((equation[4] - equation[2] * b) / equation[0])
    b = round(b)
    if equation[0] * a + equation[2] * b == equation[4] and equation[1] * a + equation[3] * b == equation[5]:
        total += 3 * a + b
print(total)