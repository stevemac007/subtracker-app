// Lightweight feature-flag helper for the backend scaffold
// Reads environment variables of the form: FEATURE_<NAME>_ENABLED
// Example: FEATURE_PAYMENTS_ENABLED=true

export function isFeatureEnabled(featureName) {
  const key = `FEATURE_${String(featureName).toUpperCase()}_ENABLED`;
  const val = process.env[key];
  if (val === undefined) {
    // Default: enable core features unless explicitly disabled
    switch (featureName) {
      case 'payments':
      case 'auth':
      case 'feature_gating':
        return true;
      default:
        return true;
    }
  }
  return val.toLowerCase() === 'true';
}
