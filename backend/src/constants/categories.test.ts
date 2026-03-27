import { isCategoryValue, CATEGORY_VALUES } from "./categories.ts";

describe("category helpers", () => {
  test("recognizes allowed values", () => {
    CATEGORY_VALUES.forEach((value) => {
      expect(isCategoryValue(value)).toBe(true);
    });
  });

  test("rejects unknown values", () => {
    expect(isCategoryValue("")).toBe(false);
    expect(isCategoryValue("unknown")).toBe(false);
    expect(isCategoryValue(undefined)).toBe(false);
    expect(isCategoryValue(null)).toBe(false);
  });
});
