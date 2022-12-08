import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_08.txt");

const grid = R.pipe(R.split("\n"), R.map(R.split("")), R.map(R.map(parseInt)));

const dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];

const outOfBounds = (grid) => ([x, y]) => (
  x < 0 || y < 0 || x >= grid[0].length || y >= grid.length
);

const score = (grid) => ([x, y]) => {
  const height = grid[y][x];
  let total = 1;
  let visibleFromOutside = false;

  for (const [dx, dy] of dirs) {
    let loc = [x, y];
    let score = 0;

    while (true) {
      const [x2, y2] = [loc[0] + dx, loc[1] + dy];
      if (outOfBounds(grid)([x2, y2])) {
        visibleFromOutside = true;
        break;
      }
      score++;
      if (grid[y2][x2] >= height) break;
      loc = [x2, y2];
    }

    total *= score;
  }

  return [visibleFromOutside, total];
};

const g = grid(data);
const [xLen, yLen] = [R.length(R.head(g)), R.length(g)];
const coords = R.chain(
  (y) => R.map((x) => [x, y], R.range(0, xLen)),
  R.range(0, yLen),
);
const partOne = R.transduce(
  R.filter(R.pipe(score(g), R.head)),
  R.add(1),
  0,
  coords,
);
const partTwo = R.transduce(R.map(R.pipe(score(g), R.last)), R.max, 0, coords);

console.log("Day 8:");
console.log(partOne);
console.log(partTwo);
