import { UrlData } from "../../interfaces";

/**
 * Inserts or replaces a link in the list based on its `slug`.
 * @param {UrlData[]} list - Current list of links
 * @param {UrlData} item - The link to insert or replace
 * @returns {UrlData[]} A new array where `link` is inserted or replaces the matching item.
 */
const upsertBySlug = (list: UrlData[], item: UrlData): UrlData[] => {
    const alreadyExists = list.some((shortUrl) => shortUrl.slug === item.slug);
    
    if (alreadyExists) {
        return list.map((link) => link.slug === item.slug ? item : link);
    };
    return [item, ...list];
};

export { upsertBySlug };
