const attempts = new Map();

const maxAttempts = 3;
const blockDuration = 1000 * 60 * 15;

export function recordLoginAttempt(ip) {
  const entry = attempts.get(ip) || { count: 0, lastAttempt: Date.now() };
  entry.count++;
  entry.lastAttempt = Date.now();
  attempts.set(ip, entry);
}

export function isBlocked(ip) {
  const entry = attempts.get(ip);
  if (!entry) return false;

  if (entry.count >= maxAttempts) {
    const timePassed = Date.now() - entry.lastAttempt;

    if (timePassed < blockDuration) {
      return true;
    } else {
      attempts.delete(ip);
      return false;
    }
  }

  return false;
}

export function resetAttempts(ip) {
  attempts.delete(ip);
}
