export async function solve() {
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  const data = await Deno.readTextFile('./input/day_01.txt');
  const elves = data.split('\n\n').map((str) => str.split('\n').map(Number));
  const sums = elves.map(sum);

  // Part one
  let biggest = 0;
  for (const s of sums) {
    if (s > biggest) biggest = s;
  }
  console.log(biggest);

  // Part two
  const sortedSums = sums.sort((a, b) => (a < b ? -1 : 1)).reverse();
  console.log(sum(sortedSums.slice(0, 3)));
}
