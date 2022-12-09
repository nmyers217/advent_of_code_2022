import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_09.txt");
const lines = R.split("\n", data);
const dirs = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };

const solve = (ropeLen) => {
  const rope = R.times(() => [0, 0], ropeLen);
  const visited = { "0,0": true };

  for (const line of lines) {
    const [dir, mag] = R.pipe(
      R.split(" "),
      R.adjust(0, R.flip(R.prop)(dirs)),
      R.adjust(1, parseInt),
    )(line);

    for (let n = 0; n < mag; n++) {
      rope[0] = R.zipWith(R.add, rope[0], dir);

      for (let i = 1; i < rope.length; i++) {
        const [dy, dx] = R.zipWith(R.subtract, rope[i - 1], rope[i]);

        if (dy < -1) {
          rope[i][0]--;
          if (dx !== 0) rope[i][1] += R.clamp(-1, 1, dx);
        } else if (dy > 1) {
          rope[i][0]++;
          if (dx !== 0) rope[i][1] += R.clamp(-1, 1, dx);
        } else if (dx < -1) {
          rope[i][1]--;
          if (dy !== 0) rope[i][0] += R.clamp(-1, 1, dy);
        } else if (dx > 1) {
          rope[i][1]++;
          if (dy !== 0) rope[i][0] += R.clamp(-1, 1, dy);
        }
      }

      visited[R.last(rope).toString()] = true;
    }
  }

  return R.length(R.keys(visited));
};

console.log("Day 9:");
console.log(solve(2));
console.log(solve(10));
