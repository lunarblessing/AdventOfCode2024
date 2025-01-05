# common:

list_a = []
list_b = []
with open('data.txt') as file:
    for line in file.readlines():
        (a,b) = line.split()
        list_a.append(int(a))
        list_b.append(int(b))
assert len(list_a) == len(list_b)
assert len(list_a) == 1000
list_a.sort()
list_b.sort()

# Part 1: total distance between the left list and the right list

difference = 0
for idx in range(len(list_a)):
    difference += abs(list_a[idx] - list_b[idx])
print(difference)


# Part 2: similarity score

list_a_occurrences = {}
similarity = 0
for item in list_a:
    if item in list_a_occurrences:
        continue
    list_a_occurrences[item] = list_a.count(item)
    count_in_list_b = list_b.count(item)
    similarity += item * list_a_occurrences[item] * count_in_list_b
    # possible optmization - count list b first, and if count is 0, just set list_a_occurrences[item] to 0 and go to next iteration.
    # also since lists are sorted, it is possible to do binary search for countring number of occurences.
print(similarity)