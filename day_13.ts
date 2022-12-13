import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_13.txt");

const pairs = R.pipe(
  R.split("\n\n"),
  R.map(R.split("\n")),
  R.map(R.map(JSON.parse)),
)(data);

const compare = (a, b) => {
  if (Number.isInteger(a) && Number.isInteger(b)) {
    return Math.sign(b - a);
  } else if (Number.isInteger(a)) {
    a = [a];
  } else if (Number.isInteger(b)) {
    b = [b];
  }

  for (let i = 0; i < a.length; i++) {
    if (i >= b.length) return -1;

    const c = compare(a[i], b[i]);
    if (c !== 0) return c;
  }

  if (a.length === b.length) return 0;

  return 1;
};

const partOne = () => {
  let result = 0;
  for (let i = 0; i < pairs.length; i++) {
    if (compare(...pairs[i]) > 0) result += i + 1;
  }
  return result;
};

const partTwo = () => {
  const newPairs = [...R.reduce(R.concat, [], pairs), [[2]], [[6]]];
  const sorted = R.reverse(R.sort(compare, newPairs));
  let result = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (R.equals(sorted[i], [[2]])) result *= i + 1;
    if (R.equals(sorted[i], [[6]])) {
      result *= i + 1;
      break;
    }
  }
  return result;
};

console.log("Day 13:");
console.log(partOne());
console.log(partTwo());
