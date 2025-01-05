# common
reports:list[list[int]] = []
with open("data.txt") as file:
    for line in file.readlines():
        reports.append([int(x) for x in line.split()])
assert len(reports) == 1000


# Part 1: How many reports are safe?

def is_safe(report:list[int]):
    increasing = report[1] > report[0]
    for idx in range(1,len(report)):
        if increasing and (report[idx] - report[idx-1] > 3 or report[idx] - report[idx-1] <= 0):
            return (False,idx)
        if not increasing and (report[idx] - report[idx-1] < -3 or report[idx] - report[idx-1] >= 0):
            return (False,idx)
    return (True,0)

safe_count = sum(is_safe(r)[0] for r in reports)
print(safe_count)


# Part 2:   if removing a single level from an unsafe report would make it safe, the report instead counts as safe.
#           How many reports are now safe?


def is_safe_with_ignoring(report):
    (safe,failure_index) = is_safe(report)
    if safe:
        return True
    report_with_removed_element = report[:failure_index-2] + report[failure_index-1:] # remove previous-1 element
    if is_safe(report_with_removed_element)[0]:
        return True
    report_with_removed_element = report[:failure_index-1] + report[failure_index:] # remove previous element
    if is_safe(report_with_removed_element)[0]:
        return True
    else:
        report_with_removed_element = report[:failure_index] + report[failure_index+1:] # remove failed element
        return is_safe(report_with_removed_element)[0]

safe_count_with_ignore = sum(is_safe_with_ignoring(r) for r in reports)
print(safe_count_with_ignore)