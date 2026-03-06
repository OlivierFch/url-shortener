import { FunctionComponent } from "react";
import { UrlData } from "../../interfaces";
import { UrlRow } from "../url-row/url-row";
import "./url-table.scss";
import React from "react";

interface UrlTableProps {
    items: UrlData[];
    onHitCountSort?: () => void;
}

const generateUrlShortTableRow = (item: UrlData) => {
    return <UrlRow key={item.slug} {...item} />;
};

interface UrlTableHeaderProps { title: string; isFilterable?: boolean; onClick?: () => void; }
const UrlTableHeader: React.FC<UrlTableHeaderProps> = ({ title, isFilterable = false, onClick }) => {
    const [isFiltered, setIsFiltered] = React.useState(false);

    const handleFilter = () => {
        setIsFiltered((prev) => !prev);
        onClick?.();
    };

    const filterSymbol = isFiltered ? "▲" : "▼";

    return (<th className="url-table__header__item" onClick={handleFilter}>{title} {(isFilterable) && filterSymbol}</th>);
};

const UrlTable: FunctionComponent<UrlTableProps> = ({ items, onHitCountSort }) => {
    if (!items.length) return (<div className="url-table__no-result">No links for the moment</div>);

    return (
        <table className="url-table">
            <thead className="url-table__header">
                <tr>
                    <UrlTableHeader title="Slug" />
                    <UrlTableHeader title="Original URL" />
                    <UrlTableHeader title="Short URL" />
                    <UrlTableHeader title="Hit count" isFilterable onClick={onHitCountSort} />
                    <UrlTableHeader title="Copy action" />
                </tr>
            </thead>
            <tbody>
                {items.map(generateUrlShortTableRow)}
            </tbody>
        </table>
    );
};

export { UrlTable };
