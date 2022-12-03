// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/ramda/index.d.ts"
import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_03.txt");

const priority = (letter) => {
  const c = letter.charCodeAt();
  return c >= 97 ? c - 96 : c - 38;
};

const sacks = R.split("\n", data);

const countSack = R.pipe(
  (sack) => R.splitEvery(R.length(sack) / 2, sack),
  R.apply(R.intersection),
  R.map(priority),
);

const partOne = R.pipe(
  R.map(countSack),
  R.flatten,
  R.sum,
)(sacks);

const partTwo = R.pipe(
  R.splitEvery(3),
  R.map(([x, ...xs]) => R.reduce(R.intersection, x, xs)),
  R.flatten,
  R.map(priority),
  R.sum,
)(sacks);

console.log("Day 3:");
console.log(partOne);
console.log(partTwo);
