import "./search-input.scss";

const SearchInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ value, onChange }) => (
    <div className="search-input__wrapper">
        <label htmlFor="search-input" className="search-input__label">Search:</label>
        <input className="search-input" id="search-input" value={value} onChange={onChange} type="text" placeholder="Search slug or url..." />
    </div>
);

export { SearchInput };
