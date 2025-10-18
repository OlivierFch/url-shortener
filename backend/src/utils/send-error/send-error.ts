import type { Response } from "express";

/**
 * Sends a standardized HTTP error response in JSON format.
 * @param {Response} res - The Express response object.
 * @param {number} status - The HTTP status code to send (e.g. 400, 403, 422).
 * @param {string} type - A machine-readable identifier for the error type
 * @param {string} title - A short, human-readable summary of the problem.
 * @param {string} [detail] - Optional detailed explanation for debugging or client display.
 *
 * @returns {Response} The Express response object, after sending the JSON payload.
 */
const sendError = (res: Response, status: number, type: string, title: string, detail?: string): Response => {
    return res.status(status).json({ type, title, status, detail });
};

export { sendError };
