import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_06.txt");

const isMarker = (markerLength) => (
  R.pipe(
    R.takeLast(markerLength),
    R.uniq,
    R.length,
    R.equals(markerLength),
  )
);

const solve = (markerLength) => (
  R.pipe(
    R.reduceWhile(R.complement(isMarker(markerLength)), R.flip(R.append), []),
    R.length,
  )
);

console.log("Day 6:");
console.log(solve(4)(data));
console.log(solve(14)(data));
