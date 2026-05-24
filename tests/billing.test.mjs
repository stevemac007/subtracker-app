// Lightweight unit tests for freemium pricing utility
import { calculateFreemiumPrice } from "../src/billing.js";

function assertAlmostEqual(a, b, message) {
  const diff = Math.abs(a - b);
  if (diff > 0.0001) {
    console.error(`FAIL: ${message} | expected ${b}, got ${a}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

function run() {
  // 1 team free -> price 0
  assertAlmostEqual(calculateFreemiumPrice(1), 0, "1 team should be free");
  // 2 teams -> 0.99
  assertAlmostEqual(calculateFreemiumPrice(2), 0.99, "2 teams should cost 0.99");
  // 5 teams -> 4 * 0.99 = 3.96
  assertAlmostEqual(calculateFreemiumPrice(5), 3.96, "5 teams should cost 3.96");
}

run();
