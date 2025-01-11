using System.Diagnostics;

var stones = File.ReadAllText("data.txt").Split().Select(long.Parse).ToList();

const int N = 75; // change to 25 for part 1 or 75 for part 2

long count = 0;
var memo = new Dictionary<(long, int), long>();
var sw = Stopwatch.StartNew();
foreach (var stone in stones)
{
    count += GetCount(stone, N);
}
System.Console.WriteLine($"Time: {sw.ElapsedMilliseconds}");
System.Console.WriteLine(count);

long GetCount(long number, int iterations)
{
    if (memo.TryGetValue((number, iterations), out var cached))
    {
        return cached;
    }
    if (number == 0)
    {
        if (iterations == 1)
        {
            return 1;
        }
        var result = GetCount(1, iterations - 1);
        memo.Add((number, iterations), result);
        return result;
    }
    var str = number.ToString();
    if (str.Length % 2 == 0)
    {
        if (iterations == 1)
        {
            return 2;
        }
        var (left, right) = (long.Parse(str[..(str.Length / 2)]), long.Parse(str[(str.Length / 2)..]));
        var result = GetCount(left, iterations - 1) + GetCount(right, iterations - 1);
        memo.Add((number, iterations), result);
        return result;
    }
    else
    {
        if (iterations == 1)
        {
            return 1;
        }
        var result = GetCount(number * 2024, iterations - 1);
        memo.Add((number, iterations), result);
        return result;
    }
}