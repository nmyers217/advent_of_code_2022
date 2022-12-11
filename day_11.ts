import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_11.txt");

const parseMonkey = (str) => {
  const lines = R.split("\n", str);
  return {
    id: R.head(R.match(/\d+/, lines[0])),
    items: R.map(parseInt, R.match(/\d+/g, lines[1])),
    op: R.pipe(R.match(/(\+|\*) (.+)/), R.tail)(lines[2]),
    test: parseInt(R.match(/\d+/, lines[3])),
    firstPass: R.head(R.match(/\d+/, lines[4])),
    sndPass: R.head(R.match(/\d+/, lines[5])),
    count: 0,
  };
};

const monkies = R.pipe(
  R.split("\n\n"),
  R.map(parseMonkey),
  R.reduce((monkies, obj) => R.assoc(obj.id, obj, monkies), {}),
);

const doOp = ([sym, str]) => (n) => {
  if (sym === "*") {
    return str === "old" ? n * n : n * parseInt(str);
  } else {
    return str === "old" ? n + n : n + parseInt(str);
  }
};

const processRound = (worried) => (monkies) => {
  for (const id of R.keys(monkies)) {
    const m = monkies[id];
    while (R.length(m.items) > 0) {
      const level = R.pipe(
        doOp(m.op),
        R.when(() => !worried, R.pipe((n) => n / 3, Math.floor)),
      )(m.items.shift());
      const passTo = level % m.test === 0 ? m.firstPass : m.sndPass;

      monkies[passTo].items.push(worried ? level % worried : level);
      m.count++;
    }
  }
  return monkies;
};

const solve = (n, worried = false) =>
  R.pipe(
    R.reduce(processRound(worried), R.__, R.times(R.identity, n)),
    R.map(R.prop("count")),
    R.values,
    R.sort(R.comparator(R.gt)),
    R.take(2),
    R.product,
  );

const state = monkies(data);
const worriedShit = R.pipe(R.map(R.prop("test")), R.values, R.product)(
  state,
);

console.log("Day 11:");
console.log(solve(20)(R.clone(state)));
console.log(solve(10_000, worriedShit)(R.clone(state)));
