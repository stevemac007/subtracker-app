// Freemium pricing utilities
// First team is free; AUD 0.99 per additional team

export const FREE_TEAMS = 1;

export function calculateFreemiumPrice(numTeams) {
  const extra = Math.max(0, (Number(numTeams) || 0) - FREE_TEAMS);
  // Round to 2 decimals to avoid floating point quirks in UI
  return Math.round((extra * 0.99 + Number.EPSILON) * 100) / 100;
}

export function formatAUD(amount) {
  const v = Number(amount) || 0;
  return `AUD ${v.toFixed(2)}`;
}
