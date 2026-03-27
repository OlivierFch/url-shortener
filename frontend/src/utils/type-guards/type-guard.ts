import { ApiErrorShape, CreateShortLinkResponse, GetAllLinksResponse, TopLinksCategory, TopLinksResponse, TopLinksWindow, TopUrlItem, UrlData, CategoryOption, CategoriesResponse } from "../../interfaces";

// Checks that we receive a simple object (no null, array, etc...)
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

// Checks API error type that should be returned by the backend
const isApiErrorShape = (value: unknown): value is ApiErrorShape => {
  if (!isPlainObject(value)) return false;

  const { type, title, status } = value;

  const hasType = typeof type === "string";
  const hasTitle = typeof title === "string";
  const hasStatus = typeof status === "number";

  const hasValidDetail = !("detail" in value) || typeof value.detail === "string";

  return hasType && hasTitle && hasStatus && hasValidDetail;
};

// Checks API URL response that should be returned by the backend
const isUrlData = (value: unknown): value is UrlData => {
  if (!isPlainObject(value)) return false;
  const { slug, shortUrl, longUrl, hitCount } = value;

  const hasSlug = typeof slug === "string";
  const hasShortUrl = typeof shortUrl === "string";
  const hasLongUrl = typeof longUrl === "string";
  const hasHitCount = typeof hitCount === "number";

  return hasSlug && hasShortUrl && hasLongUrl && hasHitCount;
};

// Checks API URL list response that should be returned by the backend
const isUrlDataArray = (value: unknown): value is UrlData[] =>
  Array.isArray(value) && value.every(isUrlData);

// Checks API POST response when a short url is created
const isCreateShortLinkResponse = (value: unknown): value is CreateShortLinkResponse => {
  if (!isPlainObject(value)) return false;

  const hasMessage = typeof value.message === "string";
  const hasValidData = isUrlData(value.data);

  return hasMessage && hasValidData;
};

// Checks API GET response when short urls are fetched
const isGetAllLinksResponse = (value: unknown): value is GetAllLinksResponse => {
  if (!isPlainObject(value)) return false;

  const hasMessage = typeof value.message === "string";
  const hasValidDataArray = isUrlDataArray(value.data);

  return hasMessage && hasValidDataArray;
};

const isTopUrlItem = (value: unknown): value is TopUrlItem => {
  if (!isPlainObject(value)) return false;

  const { slug, longUrl, shortUrl, monthlyHits, category } = value;

  const hasSlug = typeof slug === "string";
  const hasLongUrl = typeof longUrl === "string";
  const hasShortUrl = typeof shortUrl === "string";
  const hasMonthlyHits = typeof monthlyHits === "number";
  const hasValidCategory = category === undefined || category === null || typeof category === "string";

  return hasSlug && hasLongUrl && hasShortUrl && hasMonthlyHits && hasValidCategory;
};

const isTopLinksCategory = (value: unknown): value is TopLinksCategory => {
  if (!isPlainObject(value)) return false;

  const { category, categoryLabel, links } = value;

  const hasCategoryLabel = typeof categoryLabel === "string";
  const hasValidCategory = category === null || typeof category === "string";
  const hasLinks = Array.isArray(links) && links.every(isTopUrlItem);

  return hasCategoryLabel && hasValidCategory && hasLinks;
};

const isGetTopLinksResponse = (value: unknown): value is TopLinksResponse => {
  if (!isPlainObject(value)) return false;

  const { message, data } = value;
  if (typeof message !== "string" || !isPlainObject(data)) return false;

  const { periodStart, periodEnd, categories, window } = data;
  const hasPeriodStart = typeof periodStart === "string";
  const hasPeriodEnd = typeof periodEnd === "string";
  const hasCategories = Array.isArray(categories) && categories.every(isTopLinksCategory);
  const hasWindow = window === "previous" || window === "current";

  return hasPeriodStart && hasPeriodEnd && hasCategories && hasWindow;
};

const isCategoryOption = (value: unknown): value is CategoryOption => {
  if (!isPlainObject(value)) return false;

  const { value: categoryValue, label } = value;
  const hasValue = typeof categoryValue === "string";
  const hasLabel = typeof label === "string";

  return hasValue && hasLabel;
};

const isCategoriesResponse = (value: unknown): value is CategoriesResponse => {
  if (!isPlainObject(value)) return false;

  const { message, data } = value;
  const hasMessage = typeof message === "string";
  const hasData = Array.isArray(data) && data.every(isCategoryOption);

  return hasMessage && hasData;
};

export { isApiErrorShape, isCreateShortLinkResponse, isGetAllLinksResponse, isGetTopLinksResponse, isCategoriesResponse };
