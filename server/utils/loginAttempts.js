import { rateLimit } from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,         
  limit: 3,                          
  skipSuccessfulRequests: true,     
  standardHeaders: 'draft-8',        
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. Try again in 15 minutes.',
  },
});
