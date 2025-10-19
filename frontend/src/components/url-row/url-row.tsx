import { FunctionComponent } from "react";
import { CopyButton } from "../copy-button/copy-button";
import "./url-row.scss";

type UrlRowProps = {
  shortUrl: string;
  slug: string;
  longUrl: string;
  hitCount: number;
};

const UrlRow: FunctionComponent<UrlRowProps> = ({ shortUrl, slug, longUrl, hitCount }) => {
  return (
    <tr className="url-row__container">
      <td className="url-row__cell">{slug}</td>

      <td className="url-row__cell">
        <span title={longUrl}>{longUrl}</span>
      </td>

      <td className="url-row__cell">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="url-row__short-url"
          title={shortUrl}
        >
          {shortUrl}
        </a>
      </td>

      <td className="url-row__cell">{hitCount}</td>

      <td className="url-row__cell">
        <CopyButton textToCopy={shortUrl} />
      </td>
    </tr>
  );
};

export { UrlRow };
