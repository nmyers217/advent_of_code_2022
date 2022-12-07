import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_07.txt");

const defaultState = {
  tree: {},
  stack: [],
};

const nextState = ({ tree, stack }, line) => {
  if (R.startsWith("$", line)) {
    const [cmd, dir] = R.pipe(R.split(" "), R.tail)(line);
    if (cmd === "ls") return { tree, stack };
    return {
      tree,
      stack: dir === ".." ? R.dropLast(1, stack) : R.append(dir, stack),
    };
  }

  if (R.complement(R.startsWith("dir", line))) {
    const [size, name] = R.split(" ", line);
    return {
      tree: R.assocPath(R.append(name, stack), parseInt(size), tree),
      stack,
    };
  }

  return { tree, stack };
};

const allSizes = [];
const dfs = (tree) => {
  const size = R.reduce(
    (acc, [k, v]) => acc + (R.is(Number, v) ? v : dfs(tree[k])),
    0,
    R.toPairs(tree),
  );
  allSizes.push(size);
  return size;
};

const state = R.reduce(nextState, defaultState, R.split("\n", data));
const totalSize = 70_000_000;
const sizeUsed = dfs(state.tree);
const spaceNeeded = 30_000_000 - (totalSize - sizeUsed);

const partOne = R.pipe(
  R.filter(R.lt(R.__, 100_000)),
  R.sum,
);

const partTwo = R.pipe(
  R.sort(R.comparator(R.lt)),
  R.filter(R.gt(R.__, spaceNeeded)),
  R.head,
);

console.log("Day 7:");
console.log(partOne(allSizes));
console.log(partTwo(allSizes));
