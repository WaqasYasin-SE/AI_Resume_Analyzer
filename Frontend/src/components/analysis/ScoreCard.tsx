import "./ScoreCard.css";

type ScoreCardProps = {
    score: number;
};

function ScoreCard({ score }: ScoreCardProps) {
    return (
        <section className="score-card">
            <div className="score-card__header">
                <div>
                    <p className="score-card__eyebrow">
                        AI Resume Score
                    </p>

                    <h2>Resume quality</h2>
                </div>

                <span className="score-card__label">
                    / 100
                </span>
            </div>

            <div className="score-card__score">
                {score}
            </div>

            <div className="score-card__track">
                <div
                    className="score-card__progress"
                    style={{
                        width: `${Math.min(
                            Math.max(score, 0),
                            100
                        )}%`,
                    }}
                />
            </div>

            <p className="score-card__description">
                Your score reflects the overall quality,
                relevance, structure, and completeness of
                your resume.
            </p>
        </section>
    );
}

export default ScoreCard;   