// Simple mock gateway that simulates a payment processor
export async function charge({ amount, currency = 'USD', customerId }) {
  // simulate latency
  await new Promise(resolve => setTimeout(resolve, 120));
  return {
    id: 'txn_mock_' + Math.floor(Math.random() * 1000000),
    amount,
    currency,
    customerId,
    status: 'succeeded',
  };
}
