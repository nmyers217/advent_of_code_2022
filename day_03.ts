// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/ramda/index.d.ts"
import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_03.txt");

const priority = (letter) => {
  const c = letter.charCodeAt();
  return c >= 97 ? c - 96 : c - 38;
};

const sumStack = R.pipe(
  (sack) => R.splitEvery(R.length(sack) / 2, sack),
  R.apply(R.intersection),
  R.map(priority),
);

const sumGroupOfSacks = R.pipe(
  ([x, ...xs]) => R.reduce(R.intersection, x, xs),
  R.map(priority),
);

const sacks = R.split("\n", data);
const partOne = R.transduce(R.map(sumStack), R.add, 0, sacks);
const partTwo = R.transduce(
  R.map(sumGroupOfSacks),
  R.add,
  0,
  R.splitEvery(3, sacks),
);

console.log("Day 3:");
console.log(partOne);
console.log(partTwo);
