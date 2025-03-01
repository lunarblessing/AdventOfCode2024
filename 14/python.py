class Robot:
    def __init__(self, pos, vel):
        self.pos = pos
        self.vel = vel

width = 101
height = 103

robots:list[Robot] = []

with open('data.txt') as file:
    cur_equation = []
    for line in file.readlines():
        (p,v) = line.split()
        r = Robot((int(p[p.index('=') + 1 : p.index(',')]), int(p[p.index(',') + 1 :])),\
                  (int(v[v.index('=') + 1 : v.index(',')]), int(v[v.index(',') + 1 :])))
        robots.append(r)
        
quads = [0,0,0,0]
for robot in robots:
    final_x = robot.pos[0] + 100 * robot.vel[0]
    final_x = final_x % width
    final_y = robot.pos[1] + 100 * robot.vel[1]
    final_y = final_y % height
    if final_x < width // 2 and final_y < height // 2:
        quads[0] += 1
    elif final_x > width // 2 and final_y < height // 2:
        quads[1] += 1
    elif final_x < width // 2 and final_y > height // 2:
        quads[2] += 1
    elif final_x > width // 2 and final_y > height // 2:
        quads[3] += 1
print(quads[0] * quads[1] * quads[2] * quads[3])


# Part 2

# set is_outputting_html to False to search for the pattern with closest average distance to the center;
# then set it to True to construct html to see the map at this day (and be aware of off by 1 errors)
is_outputting_html = False

if is_outputting_html:
    target_second = 0 # put the output with is_outputting_html = False here
    output_html = []
    output_html.append(f"<div class=\"second_text\">Second {target_second}</div>")
    output_html.append(f"<div class=\"field\">")
    for robot in robots:
        final_x = (robot.pos[0] + target_second * robot.vel[0]) % width
        final_y = (robot.pos[1] + target_second * robot.vel[1]) % height
        output_html.append(f"<div class=\"robot\" style=\"grid-column:{final_x}; grid-row:{final_y};\"></div>")
    output_html.append(f"</div>")
    with open("part2.html") as file:
        template = file.read()
    html = template.replace("{{text}}", ''.join(output_html))
    with open("output.html", 'w') as file:
        file.write(html)

else:
    center = (width // 2, height // 2)
    min_day = 0
    min_distance = 1_000_000
    for second in range(0,10000):
        distance = 0
        for robot in robots:
            robot.pos = ((robot.pos[0] + robot.vel[0]) % width, (robot.pos[1] + robot.vel[1]) % height)
            distance += ((robot.pos[0] - center[0]) ** 2 + (robot.pos[1] - center[1]) ** 2) ** 0.5
        if distance < min_distance:
            min_day = second
            min_distance = distance
        
    print(min_day)
