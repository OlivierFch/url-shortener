import { nanoid } from "nanoid";

const generateSlug = async (length = 6): Promise<string> => {
    return nanoid(length);
};

export { generateSlug };
