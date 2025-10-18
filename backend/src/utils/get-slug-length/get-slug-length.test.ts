import { getSlugLength } from "./get-slug-length.ts";

describe("Unit test for getSlugLength", () => {
    test.each<{ attempt: number, expectedLength: number }>([
        { attempt: 1, expectedLength: 6 },
        { attempt: 2, expectedLength: 6 },
        { attempt: 3, expectedLength: 7 },
        { attempt: 4, expectedLength: 7 },
        { attempt: 5, expectedLength: 8 }
    ])("getSlugLength should return slug length '$expectedLength' on attempt number '$attempt'", ({ attempt, expectedLength }) => {
        const result = getSlugLength(attempt);
        expect(result).toStrictEqual(expectedLength);
    });
});