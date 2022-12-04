// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/ramda/index.d.ts"
import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_04.txt");

const isContained = ([s, e, s2, e2]) => (
  (s >= s2 && e <= e2) || (s2 >= s && e2 <= e)
);
const isOverlapping = ([s, e, s2, e2]) => (
  !(e < s2 || e2 < s)
);

const transformLine = R.compose(
  R.map(R.match(/(\d+)-(\d+),(\d+)-(\d+)/)),
  R.map(R.tail),
  R.map(R.map(parseInt)),
);

const pairs = R.transduce(
  transformLine,
  R.flip(R.append),
  [],
  R.split("\n", data),
);

const solve = R.transduce(R.__, R.add(1), 0, pairs);

console.log("Day 4:");
console.log(solve(R.filter(isContained)));
console.log(solve(R.filter(isOverlapping)));
