import { rateLimit } from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,          // 15 min
  limit: 3,                          // max 5 forsøg
  skipSuccessfulRequests: true,      // kun 4xx/5xx tæller
  standardHeaders: 'draft-8',        // RateLimit‑headers ➜ frontend
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. Try again in 15 minutes.',
  },
});






// const attempts = new Map();
// const maxAttempts = 3;
// const blockDuration = 1000 * 60 * 15;

// export function recordLoginAttempt(ip) {
//   const entry = attempts.get(ip) || { count: 0, lastAttempt: Date.now() };
//   entry.count++;
//   entry.lastAttempt = Date.now();
//   attempts.set(ip, entry);
// }

// export function isBlocked(ip) {
//   const entry = attempts.get(ip);
//   if (!entry) return false;

//   if (entry.count >= maxAttempts) {
//     const timePassed = Date.now() - entry.lastAttempt;

//     if (timePassed < blockDuration) {
//       return true;
//     } else {
//       attempts.delete(ip);
//       return false;
//     }
//   }

//   return false;
// }

// export function resetAttempts(ip) {
//   attempts.delete(ip);
// }
