import type { Response } from "express";
import { sendError } from "./send-error.ts";

describe("Unit test for sendError", () => {
    let mockResponse: Partial<Response> & {
        status: jest.Mock;
        json: jest.Mock;
    };

    beforeEach(() => {
        mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        };
    });

    test("sendError should calls res.status and res.json with the provided values and returns the response", () => {
        const status = 400;
        const type = "missing-long-url";
        const title = "Missing 'longUrl' in request body";
        const detail = "The request must include a non-empty 'longUrl' field.";

        const result = sendError(mockResponse as unknown as Response, status, type, title, detail);

        expect(mockResponse.status).toHaveBeenCalledWith(status);
        expect(mockResponse.json).toHaveBeenCalledWith({
        type,
        title,
        status,
        detail,
        });

        expect(result).toStrictEqual(mockResponse);
    });
});