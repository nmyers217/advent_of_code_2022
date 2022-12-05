import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_05.txt");

const parseStacks = R.pipe(
  R.split("\n"),
  R.reverse,
  R.map(R.split("")),
  R.transpose,
  R.transduce(
    R.compose(
      R.reject(R.startsWith([" "])),
      R.map(R.tail),
      R.map(R.reject(R.equals(" "))),
    ),
    R.flip(R.append),
    [],
  ),
);

const parseMoves = R.pipe(
  R.split("\n"),
  R.map(R.match(/\d+/g)),
  R.map(R.map(parseInt)),
);

const moveReducer = (reverseFn) => (stacks, [amt, from, to]) => (
  R.pipe(
    R.nth(from - 1),
    R.takeLast(amt),
    reverseFn,
    (cratesToMove) => R.adjust(to - 1, R.concat(R.__, cratesToMove), stacks),
    R.adjust(from - 1, R.dropLast(amt)),
  )(stacks)
);

const getLastStr = R.pipe(R.map(R.last), R.join(""));

const [stacksStr, movesStr] = R.split("\n\n", data);
const [stacks, moves] = [parseStacks(stacksStr), parseMoves(movesStr)];

console.log("Day 5:");
console.log(getLastStr(R.reduce(moveReducer(R.reverse), stacks, moves)));
console.log(getLastStr(R.reduce(moveReducer(R.identity), stacks, moves)));
