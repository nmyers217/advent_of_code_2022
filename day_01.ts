// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/ramda/index.d.ts"
import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_01.txt");

const sums = R.pipe(
  R.split("\n\n"),
  R.map(R.pipe(R.split("\n"), R.map(Number), R.sum)),
)(data);

const partOne = R.reduce(R.max, 0, sums)

const partTwo = R.pipe(
  R.sort(R.comparator(R.gt)),
  R.take(3),
  R.sum,
)(sums);

console.log(partOne);
console.log(partTwo);
