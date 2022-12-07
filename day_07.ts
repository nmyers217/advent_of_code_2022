import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_07.txt");

const defaultState = { tree: {}, stack: [] };

const nextState = R.cond([
  // Change directory, modify the stack
  [R.flip(R.test(/\$ cd .+/)), (state, line) => {
    const dir = R.last(R.split(" ", line));
    return R.evolve({
      tree: R.identity,
      stack: dir === ".." ? R.dropLast(1) : R.append(dir),
    }, state);
  }],

  // File found, add new file to the tree
  [R.flip(R.test(/\d+ .+/)), (state, line) => {
    const [size, name] = R.split(" ", line);
    return R.evolve({
      stack: R.identity,
      tree: R.assocPath(R.append(name, state.stack), parseInt(size)),
    }, state);
  }],

  [R.T, R.identity],
]);

const dfs = (tree) => {
  const result = [];
  const helper = (tree) => {
    const size = R.reduce(
      (acc, [k, v]) => acc + (R.is(Number, v) ? v : helper(tree[k])),
      0,
      R.toPairs(tree),
    );
    result.push(size);
    return size;
  };
  helper(tree);
  return result;
};

const { tree } = R.reduce(nextState, defaultState, R.split("\n", data));
const sizes = R.sort(R.comparator(R.lt), dfs(tree));
const spaceNeeded = 30_000_000 - (70_000_000 - R.last(sizes));

const partOne = R.pipe(R.filter(R.lt(R.__, 100_000)), R.sum);
const partTwo = R.pipe(R.filter(R.gt(R.__, spaceNeeded)), R.head);

console.log("Day 7:");
console.log(partOne(sizes));
console.log(partTwo(sizes));
