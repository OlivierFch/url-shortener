import { customAlphabet } from "nanoid";

const ALPHANUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a random slug of specified length using only alphanumeric characters.
 * @param {number} length - Length of the slug to be generated. Default is 6.
 * @returns {Promise<string>} - A promise that resolves to the generated slug.
 */
const generateSlug = async (length = 6): Promise<string> => {
    const slug = customAlphabet(ALPHANUM, length);
    return slug();
};

export { generateSlug };
