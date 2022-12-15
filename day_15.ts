import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import * as mr from "https://cdn.skypack.dev/multi-integer-range?dts";

const data = await Deno.readTextFile("./input/day_15.txt");

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

const partTwo = (dim, coords) => {
  for (let row = 0; row < dim; row++) {
    let ranges = [];
    for (const [sx, sy, bx, by] of coords) {
      const beaconDist = Math.abs(by - sy) + Math.abs(bx - sx);
      if (sy - beaconDist > row || sy + beaconDist < row) continue;
      const ty = Math.abs(row - sy);
      const tx = Math.abs(beaconDist - ty);
      const [minX, maxX] = [sx - tx, sx + tx];
      ranges = mr.append(ranges, [[minX, maxX]]);
    }
    const t = mr.subtract(ranges, [[-Infinity, 0], [dim, Infinity]]);
    if (mr.length(t) !== dim - 1) {
      return (ranges[0][1] + 1) * 4_000_000 + row;
    }
  }
};

const coords = parse(data);

console.log("Day 15:");
console.log(partOne(2_000_000, coords));
console.log(partTwo(4_000_000, coords));
