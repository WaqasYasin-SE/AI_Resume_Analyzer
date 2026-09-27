import "./StrengthsList.css";

function StrengthsList({ strengths = [] }) {
    return (
        <section className="strengths-list">
            <div className="strengths-list__header">
                <h2>Strengths</h2>
            </div>

            {strengths.length === 0 ? (
                <p className="strengths-list__empty">
                    No strengths identified.
                </p>
            ) : (
                <ul className="strengths-list__items">
                    {strengths.map(
                        (strength, index) => (
                            <li
                                key={`${strength}-${index}`}
                            >
                                <span>✓</span>
                                <p>{strength}</p>
                            </li>
                        )
                    )}
                </ul>
            )}
        </section>
    );
}

export default StrengthsList;