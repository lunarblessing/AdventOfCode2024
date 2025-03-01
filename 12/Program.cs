using Region = (int area, int perimiter, int corners);

var data = File.ReadAllLines("data.txt");
int width = data[0].Length;
int height = data.Length;

int sum = 0;
int sum2 = 0;
HashSet<(int x, int y)> visitedCells = [];

Region Move(char key, int x, int y, Region region)
{
    if (visitedCells.Contains((x, y)))
    {
        return region;
    }
    visitedCells.Add((x, y));
    region.area++;

    // Part 2: check for corners
    if (((x == 0 || data[y][x - 1] != key) && (y == 0 || data[y - 1][x] != key))
        || (x != 0 && y != 0 && data[y][x - 1] == key && data[y - 1][x] == key && data[y - 1][x - 1] != key))
    {
        region.corners++;
    }
    if (((x == width - 1 || data[y][x + 1] != key) && (y == 0 || data[y - 1][x] != key))
        || (x != width - 1 && y != 0 && data[y][x + 1] == key && data[y - 1][x] == key && data[y - 1][x + 1] != key))
    {
        region.corners++;
    }
    if (((x == 0 || data[y][x - 1] != key) && (y == height - 1 || data[y + 1][x] != key))
        || (x != 0 && y != height - 1 && data[y][x - 1] == key && data[y + 1][x] == key && data[y + 1][x - 1] != key))
    {
        region.corners++;
    }
    if (((x ==  width - 1 || data[y][x + 1] != key) && (y == height - 1 || data[y + 1][x] != key))
        || (x !=  width - 1 && y != height - 1 && data[y][x + 1] == key && data[y + 1][x] == key && data[y + 1][x + 1] != key))
    {
        region.corners++;
    }

    // Part 1: perimeter + moving through the region
    if (x == 0 || data[y][x - 1] != key)
    {
        region.perimiter++;
    }
    else
    {
        region = Move(key, x - 1, y, region);
    }
    if (x == width - 1 || data[y][x + 1] != key)
    {
        region.perimiter++;
    }
    else
    {
        region = Move(key, x + 1, y, region);
    }
    if (y == 0 || data[y - 1][x] != key)
    {
        region.perimiter++;
    }
    else
    {
        region = Move(key, x, y - 1, region);
    }
    if (y == height - 1 || data[y + 1][x] != key)
    {
        region.perimiter++;
    }
    else
    {
        region = Move(key, x, y + 1, region);
    }
    return region;
}

for (int y = 0; y < height; y++)
{
    for (int x = 0; x < width; x++)
    {
        var (area, perimiter, corners) = Move(data[y][x], x, y, (0, 0, 0));
        sum += area * perimiter;
        sum2 += area * corners;
    }
}
Console.WriteLine(sum);
Console.WriteLine(sum2);