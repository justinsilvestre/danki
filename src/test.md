
# 4 Quicksort

## Use Euclid's algorithm to divide up a plot of land into the biggest-possible squares

Euclid's algorithm states that **if you find the biggest square that will evenly fill the space leftover in an area after taking away l/w (using integer division), that will also be the biggest square that will evenly fill the whole area.**

This way you can use recursion to find the biggest square that would evenly fill 1680m x 640m. The base case is **when the length can be evenly divided by the width**.

```js
const findBiggestSquare = (length, width) => {
  const remainingLength = length % width
  return remainingLength
    ? findBiggestSquare(width, remainingLength)
    : width
}

assert(findBiggestSquare(1680, 640) == 80)
```
## Exercises

### 1. Recursively summing an array:

The base case is **when the array is as simple as possible: an empty array or a single-element array.**

```js
const sumSegment = (array, start, segmentLength) => {
  return (segmentLength === 0)
    ? 0
    : array[start]
      + sumSegment(array, start + 1, segmentLength - 1)
}

const sum = (array) => sumSegment(array, 0, array.length)

assert(sum([]) === 0)
assert(sum([5]) === 5)
assert(sum([1,2,3]) === 6)
```

### 2. Recursively counting the number of items in a list

The base case is **when the array is empty.**

```js
const length = (list, position = 0) => (
  list[position] === undefined
    ? position
    : length(list, position + 1)
  )

assert(length([]) === 0)
assert(length([5]) === 1)
assert(length([1,2,3]) === 3)
```

### 3. Recursively find the maximum number in a list

The base case is **when the array is empty or has one item.**

```js
const maxInSegment = (list, start, length) => {
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
```

### 4. Recursive binary search

The base case is **when the array is empty or has one item.**

```js
// simple search
const indexOfFrom = (array, item, start) => {
  if (start === array.length -1) return -1
  const current = array[start]
  return current === item ? start : indexOfFrom(array, item, start + 1)
}
const indexOf = (array, item) => indexOfFrom(array, item, 0)

indexOf([1,2,3], 1)
indexOf([1,2,3], 4)
```

```js
// binary search
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
```

## Exercises: array operations time complexity

5. Printing the value of each element in an array would take **O(n)**
6. Doubling the value of each element in an array would take **O(n)**
7. Doubling the value of the first element in an array would take **O(1)**
8. Creating a multiplication table with all the elements in the array would take **O(n^2)**

## Code

Quicksort is a **divide-and-conquer algorithm** that sorts an array by **partitioning the array at a pivot element into two sub-arrays, one containing elements smaller than the pivot and the other containing bigger elements than the pivot, then composing a new array from the pivot + the sub-arrays after recursively sorting them in the same way**. The base case is when **the array has one or no elements**.

```js
const partition = (array, pivot) => {
  const smaller = []
  const bigger = []

  for (const element of array)
    (element <= pivot ? smaller : bigger)
      .push(element)

  return { smaller, bigger }
}

const quickSort = (array, depth = 1) => {
  console.log(depth, array)

  if (array.length < 2) return array
  if (array.length === 2) {
    return array[0] < array[1] ? array : [array[1], array[0]]
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
```

## Running time

The speed of quicksort depends on **the partitions created by the pivot**. 

Quicksort runs in **O(n^2) time** in the worst case.

Quicksort becomes slow when **the partitions are unbalanced in size**. In such cases, what happens is **you're left over with a very large sub-array to be looped through in the next partitioning stage** (Sedgewick).

An example of **worst-case** running time for quicksort is if you have an array that is **already sorted**, and you always pivot on the first element.

Mergesort, another sorting algorithm, runs in **O(n * log(n))** time in the worst case, **like** quicksort. Quicksort is **faster** than mergesort in the average case.

The best case for quicksort is when **each partitioning stage divides the array exactly in half**, because **hen both partitions are equal in size, they are also as small as they can be, meaning the base case will be reached faster**.

The worst case for Quicksort can be avoided by **choosing a different pivot**, or by **first shuffling the array randomly** (Sedgewick).

One advantage of Quicksort besides its running time is that **it can implemented as an in-place sorting technique** (Sedgewick).

## Recap
* D&C works by **breaking a problem down into smaller and smaller pieces**. If you’re using D&C on a list, the base case is probably **an empty array or an array with one element**.
* If you’re implementing quicksort, choose **a random element** as the pivot. The average runtime of quicksort is **O(n * log(n))**!
* **The constant in Big O notation can matter sometimes**. That’s why, when compared to merge sort, quicksort is **faster, despite both being O(n * log(n)) in the worst case**.
* The constant almost never matters for **simple search versus binary search**, because **O(log n) is so much faster than O(n) when your list gets big**.

# 7 Dijkstra's algorithm

Dijkstra's algorithm works with **weighted directed graphs**. 

A weighted graph is **a graph where the edges are assigned a number, called its weight.**

Whereas breadth-first search tells you which path between two edges is **the shortest in terms of number of edges**, Dijkstra's algorithm tells you which path is **the fastest in terms of edge weight.**

Note that Dijkstra's algorithm works with only **positively** weighted graphs. For graphs that are **negatively** weighted, there is the **Bellman-Ford** algorithm.

## Code

The algorithm has 3 steps:

1. **For each of the current node's neighbors, record the shortest known route (including both path and weight) to that neighbor from any of its parents.** 
2. **Find the current node's "cheapest" unvisited neighbor.**
3. **Repeat for each node in the graph.**


```js

let cheapestPath = (graph, origin, finish) => {
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
```