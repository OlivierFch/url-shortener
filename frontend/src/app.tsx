import { useState } from "react";
import { UrlForm } from "./components/url-form/url-form";
import { ShortLinkCard } from "./components/short-link-card/short-link-card";
import { ShortUrlData } from "./interfaces";

export default function App() {
  const [items, setItems] = useState<ShortUrlData[]>([]);

  return (
    <div className="container">
      <div className="panel">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
            URL Shortener
        </h1>
        <UrlForm
          onSuccess={(shortUrlData) =>
            setItems((prev) => [shortUrlData, ...prev])
          }
        />
      </div>
      <div className="mt-lg">
        {items.map((it) => (
          <div key={it.slug} className="mt">
            <ShortLinkCard {...it} />
          </div>
        ))}
      </div>
    </div>
  );
}