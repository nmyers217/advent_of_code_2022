import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_10.txt");

const ops = R.pipe(
  R.split("\n"),
  R.map(R.pipe(R.split(" "), R.adjust(1, parseInt))),
);

const [rows, cols] = [6, 40];
const numCycles = rows * cols;
const logFor = [20, 60, 100, 140, 180, 220];
const pixels = R.repeat(" ", numCycles);

let x = 1;
let partOne = 0;

const log = (cycle) => {
  if (logFor.length > 0 && cycle >= logFor[0]) {
    partOne += logFor.shift() * x;
  }
};

const draw = (cycle) => {
  if (cycle > pixels.length) return;
  const y = cycle - 1;
  const [row, col] = [Math.floor(y / 40), y % 40];
  if (x - 1 <= col && col <= x + 1) {
    pixels[row * 40 + col] = "#";
  }
};

let cycle = 1;
const queue = ops(data);
draw(cycle);
while (R.length(queue) > 0) {
  if (cycle > numCycles) break;

  const [op, n] = queue.shift();

  if (op === "noop") {
    cycle++;
    log(cycle);
    draw(cycle);
  } else {
    cycle++;
    log(cycle);
    draw(cycle);

    cycle++;
    x += n;
    log(cycle);
    draw(cycle);
  }
}

const partTwo = R.pipe(
  R.splitEvery(40),
  R.map(R.join("")),
  R.join("\n"),
)(pixels);

console.log("Day 10:");
console.log(partOne);
console.log(partTwo);
