import "./ImprovementAreasList.css";

function ImprovementAreasList({ areas = [] }) {
    return (
        <section className="improvement-areas">
            <div className="improvement-areas__header">
                <h2>Improvement Areas</h2>
                <p>Focus areas that can make your resume stronger.</p>
            </div>

            {areas.length === 0 ? (
                <p className="improvement-areas__empty">
                    No specific improvement areas identified.
                </p>
            ) : (
                <ul className="improvement-areas__list">
                    {areas.map((area, index) => (
                        <li key={`${area}-${index}`}>
                            <span className="improvement-areas__icon">
                                →
                            </span>

                            <span>{area}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default ImprovementAreasList;