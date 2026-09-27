import "./RecommendationsList.css";

function RecommendationsList({
    recommendations = [],
}) {
    return (
        <section className="recommendations-list">
            <div className="recommendations-list__header">
                <h2>Recommendations</h2>
            </div>

            {recommendations.length === 0 ? (
                <p className="recommendations-list__empty">
                    No recommendations available.
                </p>
            ) : (
                <ol className="recommendations-list__items">
                    {recommendations.map(
                        (
                            recommendation,
                            index
                        ) => (
                            <li
                                key={`${recommendation}-${index}`}
                            >
                                <span>
                                    {index + 1}
                                </span>

                                <p>
                                    {recommendation}
                                </p>
                            </li>
                        )
                    )}
                </ol>
            )}
        </section>
    );
}

export default RecommendationsList;