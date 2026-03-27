import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { UrlForm } from "./components/url-form/url-form";
import { ApiError, UrlData } from "./interfaces";
import { getAllLinks, GetAllLinksOptions } from "./services";
import { UrlTable } from "./components/url-table/url-table";
import { upsertBySlug } from "./utils/upsert-by-slug/upsert-by-slug";
import { SearchInput } from "./components/search-input/search-input";
import { useDebounce } from "./hooks/use-debounce";
import { TopUrls } from "./components/top-urls/top-urls";
import "./app.scss";

const App = () => {
  const [items, setItems] = useState<UrlData[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hitCountSort, setHitCountSort] = useState<"asc" | "desc">("desc");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getExistingLinks = useCallback(async (options: GetAllLinksOptions) => {
    setError(null);
    try {
      const { data } = await getAllLinks(options);
      setItems(data);
    } catch (e: any) {
      if (e instanceof ApiError) {
        setError(`${e.title}${e.detail ? ` — ${e.detail}` : ""}`);
      } else {
        setError("Unexpected error occured");
      }
    }
  }, []);

  const handleHitCountSort = useCallback(() => {
    setHitCountSort((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  useEffect(() => {
    getExistingLinks({ q: debouncedSearchTerm, hitCount: hitCountSort });
  }, [debouncedSearchTerm, getExistingLinks, hitCountSort]);

  return (
    <div className="url-shortener__container">
      <div className="url-shortener__container__top">
        <section className="url-shortener__section url-shortener__section--form">
          <div>
            <h1 className="url-shortener__section__title">
              URL Shortener
            </h1>
            <UrlForm
              onSuccess={(newItem) =>
                setItems((prev) => upsertBySlug(prev, newItem))
              }
            />
            <div className="url-shortener__loading-error-section">
              {error && <p>Error : {error}</p>}
            </div>
          </div>
        </section>
        <section>
          <TopUrls />
        </section>
      </div>
      <section className="url-shortener__section url-shortener__section--table">
        <SearchInput value={searchTerm} onChange={handleSearchChange} />
        <UrlTable items={items} onHitCountSort={handleHitCountSort} />
      </section>
    </div>
  );
};

export { App };
