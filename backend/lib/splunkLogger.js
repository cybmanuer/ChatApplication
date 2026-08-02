import { getClientIp } from "./utils.js";

// Sends security-relevant events to Splunk's HTTP Event Collector (HEC).
// This is fire-and-forget: a failure here must never break or slow down
// the actual API response the user is waiting on.

export const logSecurityEvent = (eventType, req, extra = {}) => {
    const hecUrl = process.env.SPLUNK_HEC_URL;     // e.g. https://your-domain.ngrok-free.dev
    const hecToken = process.env.SPLUNK_HEC_TOKEN; // token from Splunk's HEC setup
    const index = process.env.SPLUNK_INDEX;         // e.g. chatapp_lab

    // If the lab isn't configured (e.g. running locally without ngrok up),
    // skip quietly instead of throwing errors on every request.
    if (!hecUrl || !hecToken) {
        return;
    }

    const event = {
        event_type: eventType,
        application: "BaaNudi",
        timestamp: new Date().toISOString(),
        ip: getClientIp(req),
        user_agent: req.headers["user-agent"],
        method: req.method,
        endpoint: req.originalUrl,
        userId: req.user?._id,
        email: req.user?.email,
        ...extra
    };

    const payload = {
        sourcetype: "_json",
        ...(index ? { index } : {}),
        event
    };

    fetch(`${hecUrl}/services/collector`, {
        method: "POST",
        headers: {
            "Authorization": `Splunk ${hecToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).catch((err) => {
        // Never let a logging failure affect the app itself
        console.log("Splunk HEC send failed:", err.message);
    });
};