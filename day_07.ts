import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_07.txt");

const testData = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

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
  } else if (R.startsWith("dir", line)) {
    // const dir = R.pipe(R.match(/dir (\w+)/), R.last)(line);
  } else {
    const [size, name] = R.split(" ", line);
    // console.log("FILE", name, stack);
    return {
      tree: R.assocPath(R.append(name, stack), parseInt(size), tree),
      stack,
    };
  }

  return { tree, stack };
};

const allSizes = [];
const partOne = [];
const dfs = (tree) => {
  const size = R.reduce(
    (acc, [k, v]) => acc + (R.is(Number, v) ? v : dfs(tree[k])),
    0,
    R.toPairs(tree),
  );

  if (size <= 100000) {
    partOne.push(size);
  }
  allSizes.push(size);

  return size;
};

const state = R.reduce(nextState, defaultState, R.split("\n", data));
const totalSize = 70_000_000;
const sizeUsed = dfs(state.tree);
const spaceNeeded = 30_000_000 - (totalSize - sizeUsed);

console.log(totalSize);
console.log(sizeUsed);
console.log(spaceNeeded);

const partTwo = R.pipe(
  R.sort(R.comparator(R.lt)),
  R.filter(R.gt(R.__, spaceNeeded)),
  R.head,
);

console.log("Day 7:");
console.log(R.sum(partOne));
console.log(partTwo(allSizes));
