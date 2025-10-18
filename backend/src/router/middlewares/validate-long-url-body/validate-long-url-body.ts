import { NextFunction, Request, Response } from "express";
import { canonicalizeUrl } from "../../../utils/canonicalize-url/canonicalize-url.ts";
import { sendError } from "../../../utils/send-error/send-error.ts";

const URL_MAX_LENGTH = 2048;
const ALLOWED_PROTOCOLS = ["http:", "https:"];

/**
 * Validates and canonicalizes the `longUrl` in an Express request body.
 *
 * The middleware performs:
 * - Presence & type check for `longUrl`
 * - Presence whitespace
 * - Length check against {@link URL_MAX_LENGTH}
 * - Syntactic URL parsing (via `new URL(...)`)
 * - Protocol allow-list check against {@link ALLOWED_PROTOCOLS}
 * - Canonicalization via {@link canonicalizeUrl}
 * @param {Request} req - Request object containing longUrl within body 
 * @param {Response} res - Response object to send error messages if validation fails.
 * @param {NextFunction} next - Next function to pass control to the next middleware.
 */
const validateLongUrlBody = (req: Request, res: Response, next: NextFunction) => {
    const { longUrl } = req.body;
    if (!longUrl) {
        return sendError(res, 400, "missing-long-url", "Missing longUrl in request body");
    }

    // Avoids CRLF header injection
    if (/[\u0000-\u001F\u007F]/.test(longUrl)) {
        return sendError(res, 400, 'control-chars', 'Control characters not allowed');
    }

    // Checks whitespace
    if (/\s/.test(longUrl)) {
        return sendError(res, 400, "whitespace-in-url", "URL contains whitespace", "Spaces must be percent-encoded (e.g., %20).");
    }

    if (longUrl.length > URL_MAX_LENGTH) {
        return sendError(res, 422, "url-too-long", `URL is too long (>${URL_MAX_LENGTH} chars)`);
    }

    // Checks percent-encoding
    if (/%(?![0-9a-fA-F]{2})/.test(longUrl)) {
        return sendError(res, 400, 'bad-percent-encoding', 'Invalid percent-encoding in URL');
    }

    let parsed: URL;
    try {
        parsed = new URL(longUrl);
    } catch {
        return sendError(res, 400, "invalid-url-format", "The URL is syntactically invalid");
    }

    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
        return sendError(res, 422, 'protocol-not-allowed', `Allowed: ${ALLOWED_PROTOCOLS.join(', ')}`);
    }

    try {
        const normalizedUrl = canonicalizeUrl(longUrl);
        req.body.longUrl = normalizedUrl;
    } catch {
        return sendError(res, 400, "bad-request", "Failed to canonicalize URL");
    }

    next();
};

export { validateLongUrlBody };
