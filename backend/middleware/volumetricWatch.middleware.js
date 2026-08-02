import { logSecurityEvent } from "../lib/splunkLogger.js";
import { getClientIp } from "../lib/utils.js";

// Simple in-memory request-rate watcher, applied globally to every request.
// NOTE: in-memory means this resets on every restart/redeploy and won't share
// state across multiple server instances. That's fine for a single-instance
// home lab; a real deployment would use Redis or a dedicated rate limiter
// (e.g. express-rate-limit) instead.

const WINDOW_MS = 60 * 1000; // 1 minute sliding window
const THRESHOLD = 100;        // requests from one IP in that window that trigger a flag

const requestLog = new Map(); // ip -> { count, windowStart, alerted }

export const volumetricWatch = (req, res, next) => {
    const ip = getClientIp(req);
    const now = Date.now();

    let entry = requestLog.get(ip);
    if (!entry || now - entry.windowStart > WINDOW_MS) {
        entry = { count: 0, windowStart: now, alerted: false };
    }
    entry.count += 1;

    // Only log once per window per IP — otherwise every request past the
    // threshold would spam Splunk with a fresh event.
    if (entry.count > THRESHOLD && !entry.alerted) {
        entry.alerted = true;
        logSecurityEvent("volumetric_abuse", req, {
            reason: "request_rate_exceeded",
            count: entry.count,
            window_ms: WINDOW_MS
        });
    }

    requestLog.set(ip, entry);
    next();
};

setInterval(() => {
    const now = Date.now();

    for (const [ip, entry] of requestLog.entries()) {
        if (now - entry.windowStart > WINDOW_MS) {
            requestLog.delete(ip);
        }
    }
}, WINDOW_MS);