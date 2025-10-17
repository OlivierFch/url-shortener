import { customAlphabet } from "nanoid";

const ALPHANUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateSlug = async (length = 6): Promise<string> => {
    const slug = customAlphabet(ALPHANUM, length);
    return slug();
};

export { generateSlug };
