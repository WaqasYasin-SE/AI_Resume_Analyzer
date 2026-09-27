import "./MissingItemsList.css";

function MissingItemsList({ items = [] }) {
    return (
        <section className="missing-items">
            <div className="missing-items__header">
                <h2>Missing Items</h2>
                <p>Important areas that may be missing from your resume.</p>
            </div>

            {items.length === 0 ? (
                <p className="missing-items__empty">
                    No important missing items identified.
                </p>
            ) : (
                <ul className="missing-items__list">
                    {items.map((item, index) => (
                        <li key={`${item}-${index}`}>
                            <span className="missing-items__icon">
                                !
                            </span>

                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default MissingItemsList;