import { useCallback, useEffect, useState } from "react";
import { UrlForm } from "./components/url-form/url-form";
import { ApiError, UrlData } from "./interfaces";
import { getAllLinks } from "./services";
import { UrlTable } from "./components/url-table/url-table";
import { upsertBySlug } from "./utils/upsert-by-slug/upsert-by-slug";
import "./app.scss";

const App = () => {
  const [items, setItems] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const getExistingLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllLinks();
      setItems(data);
    } catch (e: any) {
        if (e instanceof ApiError) {
          setError(`${e.title}${e.detail ? ` — ${e.detail}` : ""}`);
        } else {
          setError("Unexpected error occured");
        }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getExistingLinks();
  }, [getExistingLinks]);

  return (
    <div className="url-shortener__container">
      <div className="url-shortener__section">
        <h1 className="url-shortener__section__title">
            URL Shortener
        </h1>
        <UrlForm
          onSuccess={(newItem) =>
            setItems((prev) => upsertBySlug(prev, newItem))
          }
        />
        <div className="url-shortener__loading-error-section">
          {loading && <p>Loading…</p>}
          {error && <p>Error : {error}</p>}
        </div>
      </div>
      <UrlTable items={items} />
    </div>
  );
};

export { App };
