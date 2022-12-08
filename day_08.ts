import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_08.txt");

const grid = R.pipe(R.split("\n"), R.map(R.split("")), R.map(R.map(parseInt)));

const dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];

const outOfBounds = R.curry((grid, [y, x]) => (
  x < 0 || y < 0 || R.isNil(R.path([y, x], grid))
));

const manhattan = R.curry((end, start) => (
  Math.abs(R.sum(R.zipWith(R.subtract, end, start)))
));

const score = R.curry((grid, coord) => {
  const height = R.path(coord, grid);

  const stop = (coord) =>
    outOfBounds(grid, coord) || R.path(coord, grid) >= height;

  const transformDir = R.compose(
    R.map(R.zipWith(R.add)),
    R.map((stepFn) => [stepFn, stepFn(coord)]),
    R.map(R.apply(R.until(stop))),
  );

  const nextState = R.cond([
    [R.flip(outOfBounds(grid)), (state, endCoord) => (
      R.evolve({
        visible: R.T,
        score: R.multiply(manhattan(coord, endCoord) - 1),
      }, state)
    )],

    [R.T, (state, endCoord) => (
      R.evolve({
        visible: R.identity,
        score: R.multiply(manhattan(coord, endCoord)),
      }, state)
    )],
  ]);

  return R.transduce(
    transformDir,
    nextState,
    { visible: false, score: 1 },
    dirs,
  );
});

const g = grid(data);
const [cols, rows] = [R.length(R.head(g)), R.length(g)];
const coords = R.xprod(R.range(0, rows), R.range(0, cols));

const partOne = R.transduce(
  R.filter(R.pipe(score(g), R.prop("visible"))),
  R.add(1),
  0,
);
const partTwo = R.transduce(
  R.map(R.pipe(score(g), R.prop("score"))),
  R.max,
  0,
);

console.log("Day 8:");
console.log(partOne(coords));
console.log(partTwo(coords));
