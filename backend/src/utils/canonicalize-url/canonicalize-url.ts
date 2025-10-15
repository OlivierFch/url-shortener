import normalizeUrl from "normalize-url";

const DEFAULT_QUERY_PARAMETERS_TO_REMOVE = [
  /^utm_\w+/i, // UTM parameters (case-insensitive)
  "fbclid",    // Facebook Click Identifier
  "gclid",     // Google Click Identifier
  "mc_cid",    // Mailchimp Campaign ID
  "mc_eid"     // Mailchimp Email ID
];

/**
 * Canonicalizes a given long URL by normalizing it.
 * This includes removing hashes, trailing slashes, sorting query parameters,
 * and removing common tracking parameters.
 * @param longUrl 
 * @returns 
 */
const canonicalizeUrl = (longUrl: string): string => {
    return normalizeUrl(longUrl, {
    stripHash: true,
    removeTrailingSlash: true, 
    sortQueryParameters: true,
    removeQueryParameters: DEFAULT_QUERY_PARAMETERS_TO_REMOVE,
  });
};

export { canonicalizeUrl };
