import React, { useState } from "react";

type Props = {
  shortUrl: string;
  slug: string;
  longUrl: string;
};

const ShortLinkCard: React.FC<Props> = ({ shortUrl, slug, longUrl }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className={""}>
      <div className={""}>
        <span className={""}>{slug}</span>
        <a className={""} href={shortUrl} target="_blank" rel="noreferrer">
          {shortUrl}
        </a>
      </div>
      <button className={""} onClick={copy}>
        {copied ? "Copié ✓" : "Copier"}
      </button>
    </div>
  );
};

export { ShortLinkCard };
