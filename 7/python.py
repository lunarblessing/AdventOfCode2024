from time import perf_counter_ns

# common

equations = []

with open('data.txt') as file:
    for line in file.readlines():
        equation_result = line[:line.index(':')]
        elements = line[line.index(':')+1:].split()
        equations.append((int(equation_result), [int(e) for e in elements]))


# Part 1 - brute force, encoding operators in bit field

def calculate_result(elements, ops):
    current_result = elements[0]
    for i in range(1, len(elements)):
        bit_is_set = (ops & (1 << (i - 1)))
        if bit_is_set:
            current_result *= elements[i]
        else:
            current_result += elements[i]
    return current_result

start = perf_counter_ns()
sum_of_correct = 0
for eq in equations:
    n_of_elements = len(eq[1])
    n_of_permutations = 1 << (n_of_elements - 1)
    ops_field = 0
    for permutation in range(n_of_permutations):
        result = calculate_result(eq[1], ops_field)
        if result == eq[0]:
            sum_of_correct += result
            break
        ops_field += 1
end = perf_counter_ns()
print(sum_of_correct)
print('time', (end-start) / 1_000_000)


# Part 1 - left-to-right recursion:

def get_min_and_max(elements):
    min_n = max_n = elements[0]
    for i in range(1, len(elements)):
        (min_n, max_n) = (min(min_n + elements[i], min_n * elements[i]), max(max_n + elements[i], max_n * elements[i]))
    return (min_n, max_n)

def recursive(result, elements, current_result, start_index):
    last_index = len(elements) - 1
    for i in range(start_index, len(elements)):
        mult_result = current_result * elements[i]
        if i == last_index and mult_result == result:
            return True
        if mult_result <= result and recursive(result, elements, mult_result, i + 1): # no point in recursion if we're already overshooting
            return True
        current_result += elements[i]
        if i == last_index and current_result == result:
            return True
    return False

start = perf_counter_ns()
sum_of_correct = 0
correct_eqs = []
for eq in equations:
    (min_r, max_r) = get_min_and_max(eq[1])
    if min_r > eq[0] or max_r < eq[0]:
        continue
    if min_r == eq[0] or max_r == eq[0]:
        sum_of_correct += eq[0]
        continue
    if recursive(eq[0], eq[1], eq[1][0], 1):
        sum_of_correct += eq[0]
        correct_eqs.append(eq)
end = perf_counter_ns()
print(sum_of_correct)
print('time', (end-start) / 1_000_000)


# Part 2 - right-to-left recursion

def concat(a, b):
    return int(str(a) + str(b))

def unconcat(a, b):
    return int(str(b)[:-len(str(a))])

def can_get_result(result, elements, index):
    if result <= 0:
        return False
    if index == 0:
        return result == elements[0]
    if result % elements[index] == 0 and can_get_result(int(result / elements[index]), elements, index - 1):
        return True
    if str(result).endswith(str(elements[index])) and result != elements[index] and can_get_result(unconcat(elements[index], result), elements, index - 1):
        return True
    return can_get_result(result - elements[index], elements, index - 1)

start = perf_counter_ns()
sum_of_correct = 0
for eq in equations:
    if can_get_result(eq[0], eq[1], len(eq[1]) - 1):
        sum_of_correct += eq[0]
end = perf_counter_ns()
print(sum_of_correct)
print('time', (end-start) / 1_000_000)