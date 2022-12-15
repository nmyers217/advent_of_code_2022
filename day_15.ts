import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import * as mr from "https://cdn.skypack.dev/multi-integer-range?dts";

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

const parse = R.pipe(
  R.split("\n"),
  R.map(R.pipe(R.match(/-?\d+/g), R.map(parseInt))),
);

const partOne = (row, coords) => {
  let ranges = [];
  for (const [sx, sy, bx, by] of coords) {
    const beaconDist = Math.abs(by - sy) + Math.abs(bx - sx);

    // The sensor and beacon do not intersect the row
    if (sy - beaconDist > row || sy + beaconDist < row) continue;

    // Distance from sensor to target row
    const ty = Math.abs(row - sy);
    const tx = Math.abs(beaconDist - ty);

    // The x range the sensor covers
    const [minX, maxX] = [sx - tx, sx + tx];

    // Modify the multi range, make sure not to include beacons
    ranges = mr.append(ranges, [[minX, maxX]]);
    if (by === row) ranges = mr.subtract(ranges, [[bx, bx]]);
  }
  return mr.length(ranges);
};

const coords = parse(data);

console.log("Day 15:");
console.log(partOne(2_000_000, coords));
