const fs = require("fs");
const compile = require("./compile");

describe("compile", () => {
  const expected = `"Euclid's algorithm states that <strong>{{c1::if you find the biggest square that will evenly fill the space leftover in an area after taking away l/w (using integer division), that will also be the biggest square that will evenly fill the whole area.}}</strong>","<h1>4 Quicksort</h1>
<h2>Use Euclid's algorithm to divide up a plot of land into the biggest-possible squares</h2>
"
"<p>This way you can use recursion to find the biggest square that would evenly fill 1680m x 640m. The base case is <strong>{{c1::when the length can be evenly divided by the width}}</strong>.</p><pre><code class=""language-js"">const findBiggestSquare = (length, width) => {
  const remainingLength = length % width
  return remainingLength
    ? findBiggestSquare(width, remainingLength)
    : width
}

assert(findBiggestSquare(1680, 640) == 80)
</code></pre>","<h1>4 Quicksort</h1>
<h2>Use Euclid's algorithm to divide up a plot of land into the biggest-possible squares</h2>
"
"<p>The base case is <strong>{{c1::when the array is as simple as possible: an empty array or a single-element array.}}</strong></p><pre><code class=""language-js"">const sumSegment = (array, start, segmentLength) => {
  return (segmentLength === 0)
    ? 0
    : array[start]
      + sumSegment(array, start + 1, segmentLength - 1)
}

const sum = (array) => sumSegment(array, 0, array.length)

assert(sum([]) === 0)
assert(sum([5]) === 5)
assert(sum([1,2,3]) === 6)
</code></pre>","<h1>4 Quicksort</h1>
<h2>Exercises</h2>
<h3>1. Recursively summing an array:</h3>
"
"<p>The base case is <strong>{{c1::when the array is empty.}}</strong></p><pre><code class=""language-js"">const length = (list, position = 0) => (
  list[position] === undefined
    ? position
    : length(list, position + 1)
  )

assert(length([]) === 0)
assert(length([5]) === 1)
assert(length([1,2,3]) === 3)
</code></pre>","<h1>4 Quicksort</h1>
<h2>Exercises</h2>
<h3>2. Recursively counting the number of items in a list</h3>
"
"<p>The base case is <strong>{{c1::when the array is empty or has one item.}}</strong></p><pre><code class=""language-js"">const maxInSegment = (list, start, length) => {
  if (length === 0) return 0
  const current = list[start]
  if (length === 1) return current

  const remainingMax = maxInSegment(list, start + 1, length - 1)
  return current > remainingMax
    ? current
    : remainingMax
}
const max = (list) => maxInSegment(list, 0, list.length)
assert(max([1,6,9,34,78,90]) === 90)
</code></pre>","<h1>4 Quicksort</h1>
<h2>Exercises</h2>
<h3>3. Recursively find the maximum number in a list</h3>
"
"<p>The base case is <strong>{{c1::when the array is empty or has one item.}}</strong></p><pre><code class=""language-js"">// simple search
const indexOfFrom = (array, item, start) => {
  if (start === array.length -1) return -1
  const current = array[start]
  return current === item ? start : indexOfFrom(array, item, start + 1)
}
const indexOf = (array, item) => indexOfFrom(array, item, 0)

indexOf([1,2,3], 1)
indexOf([1,2,3], 4)
</code></pre><pre><code class=""language-js"">// binary search
const indexOfFrom = (array, item, start, length) => {
  if (length === 0) return -1
  const current = array[start]
  if (length === 1) return item === current ? start : -1

  const halfLength = ~~(length / 2)
  const indexInFirstHalf = indexOfFrom(array, item, start, halfLength)
  
  return indexInFirstHalf !== -1 ? indexInFirstHalf : indexOfFrom(array, item, start + halfLength, length - halfLength)
}
const indexOf = (array, item) => indexOfFrom(array, item, 0, array.length)

assert(indexOf([1,2,3], 1) === 0)
assert(indexOf([1,2,3], 4) === -1)
</code></pre><ol start=""5"">
<li>Printing the value of each element in an array would take <strong>{{c1::O(n)}}</strong></li>
<li>Doubling the value of each element in an array would take <strong>{{c1::O(n)}}</strong></li>
<li>Doubling the value of the first element in an array would take <strong>{{c1::O(1)}}</strong></li>
<li>Creating a multiplication table with all the elements in the array would take <strong>{{c1::O(n^2)}}</strong></li>
</ol>","<h1>4 Quicksort</h1>
<h2>Exercises</h2>
<h3>4. Recursive binary search</h3>
"
"<p>Quicksort is a <strong>{{c1::divide-and-conquer algorithm}}</strong> that sorts an array by <strong>{{c1::partitioning the array at a pivot element into two sub-arrays, one containing elements smaller than the pivot and the other containing bigger elements than the pivot, then composing a new array from the pivot + the sub-arrays after recursively sorting them in the same way}}</strong>. The base case is when <strong>{{c1::the array has one or no elements}}</strong>.</p><pre><code class=""language-js"">const partition = (array, pivot) => {
  const smaller = []
  const bigger = []

  for (const element of array)
    (element &#x3C;= pivot ? smaller : bigger)
      .push(element)

  return { smaller, bigger }
}

const quickSort = (array, depth = 1) => {
  console.log(depth, array)

  if (array.length &#x3C; 2) return array
  if (array.length === 2) {
    return array[0] &#x3C; array[1] ? array : [array[1], array[0]]
  }

  const [head, ...tail] = array
  const { smaller, bigger } = partition(tail, head)
  
  return [
    ...quickSort(smaller, depth + 1),
    head,
    ...quickSort(bigger, depth + 1)
  ]
}

const test = [5,854,345,7,9,21]
assert(quickSort(test) == '5,7,9,21,345,854')

quickSort([1, 2, 3, 4, 5, 6, 7, 8])
// call stack depth reaches 7

quickSort([4, 7, 6, 1, 8, 3, 2, 5])
// call stack depth reaches only 3
</code></pre>","<h1>4 Quicksort</h1>
<h2>Code</h2>
"
"The speed of quicksort depends on <strong>{{c1::the partitions created by the pivot}}</strong>. ","<h1>4 Quicksort</h1>
<h2>Running time</h2>
"
Quicksort runs in <strong>{{c1::O(n^2) time}}</strong> in the worst case.,"<h1>4 Quicksort</h1>
<h2>Running time</h2>
"
"Quicksort becomes slow when <strong>{{c1::the partitions are unbalanced in size}}</strong>. In such cases, what happens is <strong>{{c1::you're left over with a very large sub-array to be looped through in the next partitioning stage}}</strong> (Sedgewick).","<h1>4 Quicksort</h1>
<h2>Running time</h2>
"
"An example of <strong>{{c1::worst-case}}</strong> running time for quicksort is if you have an array that is <strong>{{c1::already sorted}}</strong>, and you always pivot on the first element.","<h1>4 Quicksort</h1>
<h2>Running time</h2>
"
"Mergesort, another sorting algorithm, runs in <strong>{{c1::O(n * log(n))}}</strong> time in the worst case, <strong>{{c1::like}}</strong> quicksort. Quicksort is <strong>{{c1::faster}}</strong> than mergesort in the average case.","<h1>4 Quicksort</h1>
<h2>Running time</h2>
"
"The best case for quicksort is when <strong>{{c1::each partitioning stage divides the array exactly in half}}</strong>, because <strong>{{c1::hen both partitions are equal in size, they are also as small as they can be, meaning the base case will be reached faster}}</strong>.","<h1>4 Quicksort</h1>
<h2>Running time</h2>
"
"The worst case for Quicksort can be avoided by <strong>{{c1::choosing a different pivot}}</strong>, or by <strong>{{c1::first shuffling the array randomly}}</strong> (Sedgewick).","<h1>4 Quicksort</h1>
<h2>Running time</h2>
"
One advantage of Quicksort besides its running time is that <strong>{{c1::it can implemented as an in-place sorting technique}}</strong> (Sedgewick).,"<h1>4 Quicksort</h1>
<h2>Running time</h2>
"
"D&#x26;C works by <strong>{{c1::breaking a problem down into smaller and smaller pieces}}</strong>. If you’re using D&#x26;C on a list, the base case is probably <strong>{{c1::an empty array or an array with one element}}</strong>.","<h1>4 Quicksort</h1>
<h2>Recap</h2>
"
"If you’re implementing quicksort, choose <strong>{{c1::a random element}}</strong> as the pivot. The average runtime of quicksort is <strong>{{c1::O(n * log(n))}}</strong>!","<h1>4 Quicksort</h1>
<h2>Recap</h2>
"
"<strong>{{c1::The constant in Big O notation can matter sometimes}}</strong>. That’s why, when compared to merge sort, quicksort is <strong>{{c1::faster, despite both being O(n * log(n)) in the worst case}}</strong>.","<h1>4 Quicksort</h1>
<h2>Recap</h2>
"
"The constant almost never matters for <strong>{{c1::simple search versus binary search}}</strong>, because <strong>{{c1::O(log n) is so much faster than O(n) when your list gets big}}</strong>.","<h1>4 Quicksort</h1>
<h2>Recap</h2>
"
"Dijkstra's algorithm works with <strong>{{c1::weighted directed graphs}}</strong>. ","<h1>7 Dijkstra's algorithm</h1>
"
"A weighted graph is <strong>{{c1::a graph where the edges are assigned a number, called its weight.}}</strong>","<h1>7 Dijkstra's algorithm</h1>
"
"Whereas breadth-first search tells you which path between two edges is <strong>{{c1::the shortest in terms of number of edges}}</strong>, Dijkstra's algorithm tells you which path is <strong>{{c1::the fastest in terms of edge weight.}}</strong>","<h1>7 Dijkstra's algorithm</h1>
"
"Note that Dijkstra's algorithm works with only <strong>{{c1::positively}}</strong> weighted graphs. For graphs that are <strong>{{c1::negatively}}</strong> weighted, there is the <strong>{{c1::Bellman-Ford}}</strong> algorithm.","<h1>7 Dijkstra's algorithm</h1>
"
"<p>The algorithm has 3 steps:</p><ol>
<li><strong>{{c1::For each of the current node's neighbors, record the shortest known route (including both path and weight) to that neighbor from any of its parents.}}</strong> </li>
<li><strong>{{c1::Find the current node's ""cheapest"" unvisited neighbor.}}</strong></li>
<li><strong>{{c1::Repeat for each node in the graph.}}</strong></li>
</ol><pre><code class=""language-js"">let cheapestPath = (graph, origin, finish) => {
  const toVisit = []
  const costsFromOrigin = {}
  const cheapestParents = {}
  for (const vertex in graph) {
    toVisit.push(vertex)
    costsFromOrigin[vertex] = Infinity
  }
  
  let currentVertex = origin
  let currentVertexCostFromOrigin = 0
  while (toVisit.length) {
    const currentNeighbors = graph[currentVertex]

    for (const neighbor in currentNeighbors) {
      const currentToNeighborCost = currentNeighbors[neighbor]
      const pendingNeighborCostFromOrigin = currentVertexCostFromOrigin + currentToNeighborCost
      if (costsFromOrigin[neighbor] > pendingNeighborCostFromOrigin) {
        costsFromOrigin[neighbor] = pendingNeighborCostFromOrigin
        cheapestParents[neighbor] = currentVertex
      }
    }

    let [cheapest] = Object.keys(currentNeighbors)
      .sort((a, b) => currentNeighbors[a] - currentNeighbors[b])
    const cheapestIndex = toVisit.indexOf(cheapest);
    [currentVertex] = toVisit.splice(cheapestIndex, 1)
    currentVertexCostFromOrigin = costsFromOrigin[currentVertex]

  }
  return costsFromOrigin[finish]
}
const paths = {
  start: { a: 6, b: 2 },
  a: { finish: 1 },
  b: { a: 3, finish: 5 },
  finish: {},
}


assert(cheapestPath(paths, 'start', 'finish') === 6)
assert(cheapestPath(paths, 'start', 'a') === 5)
</code></pre>","<h1>7 Dijkstra's algorithm</h1>
<h2>Code</h2>
"`;

  test("compiles csv", () => {
    const markdownText = fs.readFileSync("src/test.md");

    const csv = compile(markdownText);

    expect(csv).toEqual(expected);
  });

  test("Creates only one cloze deletion in the event of nested strong tags", () => {
    const markdownText = `**Hello __there__**`;

    expect(compile(markdownText)).toEqual(
      `<strong>{{c1::Hello <strong>there</strong>}}</strong>,`
    );
  });

  test("Creates cloze deletion inside nested strong tag", () => {
    const markdownText = `*Hello __there__*`;

    expect(compile(markdownText)).toEqual(
      `<em>Hello <strong>{{c1::there}}</strong></em>,`
    );
  });

  test("attaches ordered list to previous paragraph", () => {
    const markdownText = `hey!

1. a
2. **b**
3. c`;

    expect(compile(markdownText)).toEqual(`"<p>hey!</p><ol>
<li>a</li>
<li><strong>{{c1::b}}</strong></li>
<li>c</li>
</ol>",`);
  });
});
