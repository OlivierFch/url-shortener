/**
 * Gets the slug length based on the attempt number.
 * @param {number} attempt - The current attempt number.
 * @returns {number} The slug length for the given attempt.
 */
const getSlugLength = (attempt: number): number => {
    if (attempt <= 2) return 6;
    if (attempt <= 4) return 7;
    return 8;
};

export { getSlugLength };
