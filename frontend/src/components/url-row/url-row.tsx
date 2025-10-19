import { FunctionComponent } from "react";
import { CopyButton } from "../copy-button/copy-button";

type UrlRowProps = {
  shortUrl: string;
  slug: string;
  longUrl: string;
  hitCount: number;
};

const UrlRow: FunctionComponent<UrlRowProps> = ({ shortUrl, slug, longUrl, hitCount }) => {
  return (
    <tr className="url-short-card__container">
      <td className="url-short-card__cell">{slug}</td>

      <td className="url-short-card__cell">
        <span title={longUrl}>{longUrl}</span>
      </td>

      <td className="url-short-card__cell">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="url-short-card__short-url"
          title={shortUrl}
        >
          {shortUrl}
        </a>
      </td>

      <td className="url-short-card__cell">{hitCount}</td>

      <td className="url-short-card__cell">
        <CopyButton textToCopy={shortUrl} />
      </td>
    </tr>
  );
};

export { UrlRow };
