import { FunctionComponent } from "react";
import { UrlData } from "../../interfaces";
import { UrlRow } from "../url-row/url-row";
import "./url-table.scss";

interface UrlTableProps {
    items: UrlData[];
}

const generateUrlShortTableRow = (item: UrlData) => {
    return <UrlRow key={item.slug} {...item} />;
};

const UrlTable: FunctionComponent<UrlTableProps> = ({ items }) => {
    if (!items.length) return (<div className="url-table__no-result">No links for the moment</div>);

    return (
        <table className="url-table">
            <thead className="url-table__header">
                <tr>
                    <th className="url-table__header__item">Slug</th>
                    <th className="url-table__header__item">Original URL</th>
                    <th className="url-table__header__item">Short URL</th>
                    <th className="url-table__header__item">Hits</th>
                    <th className="url-table__header__item">Copy action</th>
                </tr>
            </thead>
            <tbody>
                {items.map(generateUrlShortTableRow)}
            </tbody>
        </table>
    );
};

export { UrlTable };
