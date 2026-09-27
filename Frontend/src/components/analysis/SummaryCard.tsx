import "./SummaryCard.css";

type SummaryCardProps = {
    summary: string;
};

function SummaryCard({ summary }: SummaryCardProps) {
    return (
        <section className="summary-card">
            <div className="summary-card__header">
                <h2>Summary</h2>
            </div>

            <p className="summary-card__text">
                {summary}
            </p>
        </section>
    );
}

export default SummaryCard;