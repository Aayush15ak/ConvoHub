import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    message: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const MessageRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 messages per window
  message: {
    message: "Too many messages, slow down!"
  },
  standardHeaders: true,
  legacyHeaders: false,
});