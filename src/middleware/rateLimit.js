// src/middleware/rateLimit.js
import rateLimiter from "../config/upstash.js";

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const { success } = await rateLimiter.limit("global"); // You can customize key (e.g., req.ip)

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next(error);
  }
};

export default rateLimitMiddleware;
