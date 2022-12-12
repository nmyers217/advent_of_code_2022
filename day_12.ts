import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { BinaryHeap } from "https://deno.land/std@0.167.0/collections/binary_heap.ts";

const data = await Deno.readTextFile("./input/day_12.txt");

const map = R.pipe(R.split("\n"), R.map(R.split("")))(data);

let [start, end] = [null, null];
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === "S") {
      start = [y, x];
      map[y][x] = "a";
    }
    if (map[y][x] === "E") {
      end = [y, x];
      map[y][x] = "z";
    }
    map[y][x] = map[y][x].charCodeAt() - 97;
  }
}

type Entry = [number, number[]];
const comparator = R.comparator((a: Entry, b: Entry) => a[0] < b[0]);

const dijkstra = (start) => {
  const queue = new BinaryHeap<Entry>(comparator);
  queue.push([0, start!]);
  const seen = { [start.toString()]: 0 };

  while (!queue.isEmpty()) {
    const [moves, [y, x]] = queue.pop();

    if (y === end[0] && x === end[1]) {
      return moves;
    }

    for (const [dy, dx] of [[0, -1], [-1, 0], [0, 1], [1, 0]]) {
      const [y2, x2] = [y + dy, x + dx];
      if (y2 < 0 || y2 >= map.length || x2 < 0 || x2 >= map[0].length) continue;
      if ((map[y2][x2] - map[y][x]) > 1) continue;
      if (seen[[y2, x2].toString()] > 0) continue;
      queue.push([moves + 1, [y2, x2]]);
      seen[[y2, x2].toString()] = moves + 1;
    }
  }
};

const allStarts = [];
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === 0) allStarts.push([y, x]);
  }
}

const partOne = dijkstra(start);
const partTwo = R.reduce(R.min, Infinity, R.map(dijkstra, allStarts));

console.log("Day 12:");
console.log(partOne);
console.log(partTwo);
