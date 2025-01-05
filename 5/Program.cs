var data = File.ReadAllLines("data.txt");
var indexOfEmpty = Array.IndexOf(data, "");
var rules = data[..indexOfEmpty];
var updates = data[(indexOfEmpty + 1)..];

var ruleLookup = (
    from rule in rules
    let idx = rule.IndexOf('|')
    select (before: rule[..idx], after: rule[(idx + 1)..])
).ToLookup(x => int.Parse(x.before), x => int.Parse(x.after));
var updateMatrix = (
    from update in updates
    let split = update.Split(',')
    select split.Select(int.Parse).ToArray()
).ToArray();

bool CorrectSoFar(int[] update, int curIndex)
{
    int currentNumber = update[curIndex];
    for (int i = 0; i < curIndex; i++)
    {
        if (!ruleLookup[update[i]].Contains(currentNumber))
        {
            return false;
        }
    }
    return true;
}

int[] FixUpdate(int[] update)
{
    var priorities = new Dictionary<int, int>(update.Length);
    foreach (var number in update)
    {
        var lookup = ruleLookup[number];
        priorities[number] = update.Count(x => x != number && lookup.Contains(x));
    }
    return  (from p in priorities
            orderby p.Value descending
            select p.Key).ToArray();
}

int sum = 0;
int sum_2 = 0;
foreach (var update in updateMatrix)
{
    bool correct = true;
    for (int i = 1; i < update.Length; i++)
    {
        if (!CorrectSoFar(update, i)) {
            correct = false;
            break;
        }
    }
    if (correct)
    {
        sum += update[update.Length / 2];
    }
    else
    {
        var correctedUpdate = FixUpdate(update);
        sum_2 += correctedUpdate[correctedUpdate.Length / 2];
    }
}
Console.WriteLine(sum);
Console.WriteLine(sum_2);