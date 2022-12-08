import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_08.txt");

const testData = `30373
25512
65332
33549
35390`;

const grid = R.pipe(
  R.split("\n"),
  R.map(R.split("")),
  R.map(R.map(parseInt)),
);

const dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];

const outOfBounds = ([x, y], grid) => (
  x < 0 || y < 0 || x >= grid[0].length || y >= grid.length
);

const visibleFromOutside = ([x, y], grid) => {
  const height = grid[y][x];

  for (const [dx, dy] of dirs) {
    let loc = [x, y];

    while (true) {
      const [x2, y2] = [loc[0] + dx, loc[1] + dy];
      if (outOfBounds([x2, y2], grid)) return true;
      if (grid[y2][x2] >= height) break;
      loc = [x2, y2];
    }
  }

  return false;
};

const score = ([x, y], grid) => {
  const height = grid[y][x];
  let result = 1;

  for (const [dx, dy] of dirs) {
    let loc = [x, y];
    let score = 0;

    while (true) {
      const [x2, y2] = [loc[0] + dx, loc[1] + dy];
      if (outOfBounds([x2, y2], grid)) break;
      score++;
      if (grid[y2][x2] >= height) break;
      loc = [x2, y2];
    }

    result *= score;
  }

  return result;
};

const bfs = (grid) => {
  let bestScore = 0;
  let result = 0;
  const queue = [[0, 0]];
  const seen = {};

  while (R.length(queue) > 0) {
    const [x, y] = queue.shift();

    if (seen[`${x},${y}`]) continue;

    bestScore = R.max(bestScore, score([x, y], grid));

    if (
      x === 0 || y === 0 || x === grid[0].length - 1 || y === grid.length - 1 ||
      visibleFromOutside([x, y], grid)
    ) {
      result++;
    }

    for (const [dx, dy] of dirs) {
      const [nx, ny] = [x + dx, y + dy];
      if (outOfBounds([nx, ny], grid)) {
        continue;
      }
      if (R.includes([nx, ny], seen)) {
        continue;
      }
      queue.push([nx, ny]);
    }

    seen[`${x},${y}`] = true;
  }

  return [result, bestScore];
};

console.log("Day 8:");
R.map(console.log, bfs(grid(data)));
