import { charge as mockCharge } from './mock.js';

export async function charge(opts) {
  const provider = (process.env.GATEWAY_PROVIDER || 'mock').toLowerCase();
  if (provider === 'mock') {
    return mockCharge(opts);
  }
  throw new Error(`Unsupported gateway provider: ${provider}`);
}
