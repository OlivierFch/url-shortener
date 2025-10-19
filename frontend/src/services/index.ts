import { env } from "../env";
import { ApiError, CreateShortLinkResponse, GetAllLinksResponse } from "../interfaces";
import { isApiErrorShape, isCreateShortLinkResponse, isGetAllLinksResponse } from "../utils/type-guards/type-guard";

const BASE = env.VITE_API_BASE_URL ?? "http://localhost:3000";

const safeJson = async (res: Response): Promise<unknown> => {
  try { return await res.json(); } catch { return null; }
};

const readJsonOrThrow = async (res: Response): Promise<unknown> => {
  const body = await safeJson(res);

  if (!res.ok) {
    if (isApiErrorShape(body)) {
      throw new ApiError(body);
    }
    throw new ApiError({
      type: "http-error",
      title: `HTTP ${res.status}`,
      status: res.status,
      detail: typeof body === "string" ? body : undefined,
    });
  }
  return body;
};

/**
 * Creates a new short link for the given long URL.
 * @param {string} longUrl - The original long URL to be shortened.
 * @returns {Promise<CreateShortLinkResponse>} The response containing the short url details.
 */
const createShortLink = async (longUrl: string): Promise<CreateShortLinkResponse> => {
    const res = await fetch(`${BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl })
    });
    
    const body = await readJsonOrThrow(res);

    if (isCreateShortLinkResponse(body)) {
        return { data: body.data, message: body.message };
    }

    throw new ApiError({
        type: "unexpected",
        title: "Unexpected response from POST /",
        status: 500,
    });
}

/**
 * Gets all existing urls.
 * @returns {Promise<GetAllLinksResponse>} An array of short link responses.
 */
const getAllLinks = async (): Promise<GetAllLinksResponse> => {
    const res = await fetch(`${BASE}/links`);
    const body = await readJsonOrThrow(res);

    if (isGetAllLinksResponse(body)) {
        return { data: body.data, message: body.message };
    }

    throw new ApiError({
        type: "unexpected-error",
        title: "Unexpected response from GET /links",
        status: 500,
    });
};

export { createShortLink, getAllLinks };
