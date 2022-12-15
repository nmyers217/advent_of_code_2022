import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_15.txt");

const testData = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const points = R.pipe(
  R.split("\n"),
  R.map(R.match(/-?\d+/g)),
  R.map(R.map(parseInt)),
)(testData);

const map = {};
for (const [sx, sy, bx, by] of points) {
  map[[sx, sy].toString()] = [bx, by];
}

const toPoint = R.pipe(R.split(","), R.map(parseInt));
const toSet = (arr) =>
  R.reduce(
    (acc, el) => {
      acc[el.toString()] = true;
      return acc;
    },
    {},
    arr,
  );
const manhattan = R.pipe(R.zipWith(R.subtract), R.map(Math.abs), R.sum);

const sensors = R.pipe(
  Object.keys,
  R.map(toPoint),
  toSet,
)(map);

const row = 10;
// const row = 2_000_000;
const emptyPoints = {};
for (const k of Object.keys(map)) {
  const [sx, sy] = toPoint(k);
  const [bx, by] = map[k];
  const beaconDist = manhattan([sx, sy], [bx, by]);

  // console.log(k);

  for (let x = sx - beaconDist; x < sx + beaconDist; x++) {
    if (x === bx && row === by) continue;
    const dist = manhattan([sx, sy], [x, row]);
    if (dist > beaconDist) continue;
    emptyPoints[[x, row].toString()] = true;
  }
}

const partOne = Object.keys(emptyPoints).length;

console.log("Day 15:");
console.log(partOne);
