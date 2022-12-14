import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { toString } from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_14.txt");

const testData = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const parse = R.pipe(
  R.split("\n"),
  R.map(R.match(/\d+/g)),
  R.map(R.map(parseInt)),
  R.map(R.splitEvery(2)),
);

const paths = parse(data);

let abyss = 0;
const buildGrid = () => {
  const result = {};
  for (const path of paths) {
    for (let i = 1; i < path.length; i++) {
      const [a, b] = [path[i - 1], path[i]];
      const [dx, dy] = [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])];

      let [x, y] = a;
      while (x !== b[0] || y !== b[1]) {
        result[[x, y].toString()] = true;
        x += dx;
        y += dy;
        if (y > abyss) abyss = y;
      }
      result[[x, y].toString()] = true;
    }
  }
  return result;
};

let grid = buildGrid();
let partOne = 0;
while (true) {
  let [x, y] = [500, 0];

  const fallDown = () => {
    while (!grid[[x, y + 1].toString()]) {
      if (y > abyss) return;
      y += 1;
    }
    if (!grid[[x - 1, y + 1].toString()]) {
      x--;
      y++;
      fallDown();
    } else if (!grid[[x + 1, y + 1].toString()]) {
      x++;
      y++;
      fallDown();
    }
  };

  fallDown();
  if (y > abyss) break;

  grid[[x, y].toString()] = true;
  partOne++;
}

grid = buildGrid();
const floor = abyss + 2;
let [minX, maxX] = [Infinity, -Infinity];
for (const str of Object.keys(grid)) {
  const x = parseInt(R.split(",", str)[0]);
  minX = Math.min(minX, x);
  maxX = Math.max(maxX, x);
}
minX -= 1000;
maxX += 1000;
for (let x = minX; x <= maxX; x++) {
  grid[[x, floor].toString()] = true;
}

let partTwo = 0;
while (true) {
  let [x, y] = [500, 0];

  const fallDown = () => {
    while (!grid[[x, y + 1].toString()]) {
      y += 1;
    }
    if (!grid[[x - 1, y + 1].toString()]) {
      x--;
      y++;
      fallDown();
    } else if (!grid[[x + 1, y + 1].toString()]) {
      x++;
      y++;
      fallDown();
    }
  };

  fallDown();
  partTwo++;
  if (x === 500 && y === 0) break;
  grid[[x, y].toString()] = true;
}

console.log("Day 14:");
console.log(partOne);
console.log(partTwo);
