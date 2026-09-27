import "./IssuesList.css";

function IssuesList({ weaknesses = [] }) {
    return (
        <section className="issues-list">
            <div className="issues-list__header">
                <h2>Weaknesses</h2>
            </div>

            {weaknesses.length === 0 ? (
                <p className="issues-list__empty">
                    No major weaknesses identified.
                </p>
            ) : (
                <ul className="issues-list__items">
                    {weaknesses.map(
                        (weakness, index) => (
                            <li
                                key={`${weakness}-${index}`}
                            >
                                <span>!</span>
                                <p>{weakness}</p>
                            </li>
                        )
                    )}
                </ul>
            )}
        </section>
    );
}

export default IssuesList;