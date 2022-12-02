// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/ramda/index.d.ts"
import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const data = await Deno.readTextFile("./input/day_02.txt");

const letterToShape = {
  "A": "rock",
  "B": "paper",
  "C": "scissors",
  "X": "rock",
  "Y": "paper",
  "Z": "scissors",
};
const letterToResult = { "X": "lose", "Y": "draw", "Z": "win" };
const shapeToScore = { rock: 1, paper: 2, scissors: 3 };
const resultToScore = { win: 6, draw: 3, lose: 0 };
const moveToScore = {
  rock: {
    paper: shapeToScore["paper"] + resultToScore.win,
    rock: shapeToScore["rock"] + resultToScore.draw,
    scissors: shapeToScore["scissors"] + resultToScore.lose,
  },
  paper: {
    scissors: shapeToScore["scissors"] + resultToScore.win,
    paper: shapeToScore["paper"] + resultToScore.draw,
    rock: shapeToScore["rock"] + resultToScore.lose,
  },
  scissors: {
    rock: shapeToScore["rock"] + resultToScore.win,
    scissors: shapeToScore["scissors"] + resultToScore.draw,
    paper: shapeToScore["paper"] + resultToScore.lose,
  },
};
const shapeAndResultToScore = {
  rock: {
    win: moveToScore.rock.paper,
    draw: moveToScore.rock.rock,
    lose: moveToScore.rock.scissors,
  },
  paper: {
    win: moveToScore.paper.scissors,
    draw: moveToScore.paper.paper,
    lose: moveToScore.paper.rock,
  },
  scissors: {
    win: moveToScore.scissors.rock,
    draw: moveToScore.scissors.scissors,
    lose: moveToScore.scissors.paper,
  },
};

const rounds = R.split("\n", data);

const partOne = R.pipe(
  R.props(R.__, letterToShape),
  R.path(R.__, moveToScore),
);

const partTwo = R.pipe(
  ([o, p]) => [R.prop(o, letterToShape), R.prop(p, letterToResult)],
  R.path(R.__, shapeAndResultToScore),
);

const play = (scoreMoveFn) => (
  R.pipe(
    R.map(
      R.pipe(
        R.split(" "),
        scoreMoveFn,
      ),
    ),
    R.sum,
  )(rounds)
);

console.log("Day 2:");
console.log(play(partOne));
console.log(play(partTwo));
