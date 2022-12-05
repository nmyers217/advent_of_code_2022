import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { split } from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_05.txt");

const parseStacks = (str) => {
  const transposedLines = R.pipe(
    R.split("\n"),
    R.reverse,
    R.map(R.split("")),
    R.transpose,
  );

  const transformLine = R.compose(
    R.reject(R.startsWith([" "])),
    R.map(R.tail),
    R.map(R.reject(R.equals(" "))),
  );

  return R.transduce(
    transformLine,
    R.flip(R.append),
    [],
    transposedLines(str),
  );
};

const parseMoves = R.pipe(
  R.split("\n"),
  R.map(R.match(/\d+/g)),
  R.map(R.map(parseInt)),
);

const [stacksStr, movesStr] = split("\n\n", data);
const [stacks, moves] = [parseStacks(stacksStr), parseMoves(movesStr)];

for (const [amt, from, to] of moves) {
  for (let i = 0; i < amt; i++) {
    if (stacks[from - 1].length > 0) {
      stacks[to - 1].push(stacks[from - 1].pop());
    }
  }
}

const moreStacks = parseStacks(stacksStr);

for (const [amt, from, to] of moves) {
  let arr = [];
  for (let i = 0; i < amt; i++) {
    if (moreStacks[from - 1].length > 0) {
      arr = arr.concat(moreStacks[from - 1].pop());
    }
  }
  moreStacks[to - 1].push(...arr.reverse());
}

console.log("Day 5:");
console.log(R.join("", R.map(R.last, stacks)));
console.log(R.join("", R.map(R.last, moreStacks)));
