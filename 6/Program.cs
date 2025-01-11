using System.Diagnostics;

var data = File.ReadAllLines("data.txt");
// be aware that points matrix will have [y][x] indexing, while guard, direction will use (x,y) values
var guard = (x: 0, y: 0);
var direction = (x: 0, y: -1);
var points = new State[data.Length][];
for (int i = 0; i < points.Length; i++)
{
    (points[i], int guardX) = ConvertLine(data[i]);
    if (guardX != -1)
    {
        guard = (guardX, i);
    }
}
var originalGuard = guard;


// Part 1:

int visitedCount = 1;
var originalPath = new HashSet<(int x, int y)>(points.Length * points[0].Length); // needed for part 2
while (Move(false)) // part 1
{
    if (guard != originalGuard)
    {
        originalPath.Add(guard);
    }
}
Console.WriteLine(visitedCount);


// Part 2

int loopCount = 0;
var visitedCells = new int[points.Length][];
for (int i = 0; i < visitedCells.Length; i++)
{
    visitedCells[i] = new int[points[0].Length];
};
var sw = Stopwatch.StartNew();
foreach (var extraObstacle in originalPath)
{
    guard = originalGuard;
    direction = (0, -1);
    ResetVisitedCells();
    visitedCells[guard.y][guard.x] = 1 << DirToInt();
    // don't care about traversed/free state, only about obstacle
    points[extraObstacle.y][extraObstacle.x] = State.Obstacle;
    while (Move(true))
    {
        var dir = DirToInt();
        if (((visitedCells[guard.y][guard.x] >> dir) & 1) == 0)
        {
            // haven't moved in that direction yet
            visitedCells[guard.y][guard.x] += 1 << dir;
        }
        else
        {
            // we're on a loop
            loopCount++;
            break;
        }
    }
    points[extraObstacle.y][extraObstacle.x] = State.Free; // reset state
}
sw.Stop();
System.Console.WriteLine(sw.ElapsedMilliseconds);
Console.WriteLine(loopCount);


void ResetVisitedCells()
{
    for (int i = 0; i < visitedCells.Length; i++)
    {
        for (int j = 0; j < visitedCells[0].Length; j++)
        {
            visitedCells[i][j] = 0;
        }
    }
}

int DirToInt()
{
    return direction.x + direction.y + direction.x + 2;
}

bool Move(bool quick)
{
    if (guard.y + direction.y < 0 || guard.y + direction.y >= points.Length || guard.x + direction.x < 0 || guard.x + direction.x >= points[0].Length)
    {
        return false;
    }
    try
    {
        while (points[guard.y + direction.y][guard.x + direction.x] == State.Obstacle)
        {
            direction = (-direction.y, direction.x); // rotate by 90deg clockwise
        }
        guard = (guard.x + direction.x, guard.y + direction.y);
        if (quick)
        {
            return true;
        }
        if (points[guard.y][guard.x] == State.Free)
        {
            visitedCount++;
            points[guard.y][guard.x] = State.Traversed;
        }
        return true;
    }
    catch (IndexOutOfRangeException)
    {
        return false; // got out of map
    }
}

(State[] points, int guardX) ConvertLine(string line)
{
    var points = new State[line.Length];
    int guardX = -1;
    for (int i = 0; i < line.Length; i++)
    {
        points[i] = line[i] switch
        {
            '.' => State.Free,
            '#' => State.Obstacle,
            '^' => State.Traversed,
            _ => throw new ArgumentException("something went wrong")
        };
        if (line[i] == '^')
        {
            guardX = i;
        }
    }
    return (points, guardX);
}

enum State
{
    Free, Traversed, Obstacle
}
