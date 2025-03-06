export function sleepRandom(minSeconds, maxSeconds) {
  const delay = Math.random() * (maxSeconds - minSeconds) + minSeconds;
  console.log(`⏳ Pausing execution for ${delay.toFixed(2)} seconds...`);

  return new Promise((resolve) => setTimeout(resolve, delay * 1000));
}
