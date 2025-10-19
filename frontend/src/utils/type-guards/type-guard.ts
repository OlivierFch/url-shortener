import { ApiErrorShape, CreateShortLinkResponse, GetAllLinksResponse, UrlData } from "../../interfaces";

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

export { isApiErrorShape, isCreateShortLinkResponse, isGetAllLinksResponse };
