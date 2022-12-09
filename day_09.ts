import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_09.txt");
const dirs = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };

const moveTo = (vecA, vecB) => {
  const result = R.clone(vecB);
  const [dy, dx] = R.zipWith(R.subtract, vecA, vecB);
  if (Math.abs(dy) > 1) {
    result[0] += dy < 0 ? -1 : 1;
    if (dx !== 0) result[1] += R.clamp(-1, 1, dx);
  } else if (Math.abs(dx) > 1) {
    result[1] += dx < 0 ? -1 : 1;
    if (dy !== 0) result[0] += R.clamp(-1, 1, dy);
  }
  return result;
};

const simulate = (ropeLen) => (data) => (
  R.transduce(
    R.map(R.pipe(
      R.split(" "),
      ([dirStr, nStr]) => [R.prop(dirStr, dirs), parseInt(nStr)],
    )),
    ({ rope, visited }, [dir, mag]) => (
      R.reduce(
        ({ rope, visited }, _) => {
          rope[0] = R.zipWith(R.add, rope[0], dir);
          for (let i = 1; i < rope.length; i++) {
            rope[i] = moveTo(rope[i - 1], rope[i]);
          }
          visited[R.last(rope).toString()] = true;
          return { rope, visited };
        },
        { rope, visited },
        R.times(R.identity, mag),
      )
    ),
    {
      rope: R.times(() => [0, 0], ropeLen),
      visited: { "0,0": true },
    },
    R.split("\n", data),
  )
);

const solve = (ropeLen) => (
  R.pipe(simulate(ropeLen), R.prop("visited"), R.keys, R.length)
);

console.log("Day 9:");
console.log(solve(2)(data));
console.log(solve(10)(data));
