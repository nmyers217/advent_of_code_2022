// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/ramda/index.d.ts"
import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_01.txt");

const sums = R.pipe(
  R.split("\n\n"),
  R.map(R.pipe(R.split("\n"), R.map(Number), R.sum)),
  R.sort(R.comparator(R.gt)),
)(data);

console.log('Day 1:')
console.log(R.take(1, sums)[0]);
console.log(R.sum(R.take(3, sums)));
