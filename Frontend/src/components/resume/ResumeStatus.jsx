import "./ResumeStatus.css";

function ResumeStatus({ status }) {
    const normalizedStatus =
        status?.toLowerCase();

    const statusConfig = {
        pending: {
            label: "Pending",
            className: "resume-status--pending",
        },

        processing: {
            label: "Processing",
            className: "resume-status--processing",
        },

        completed: {
            label: "Analysis Complete",
            className: "resume-status--completed",
        },

        failed: {
            label: "Processing Failed",
            className: "resume-status--failed",
        },
    };

    const current =
        statusConfig[normalizedStatus] ||
        {
            label: "Unknown",
            className: "resume-status--unknown",
        };

    return (
        <span
            className={`resume-status ${current.className}`}
        >
            <span className="resume-status__dot" />

            {current.label}
        </span>
    );
}

export default ResumeStatus;