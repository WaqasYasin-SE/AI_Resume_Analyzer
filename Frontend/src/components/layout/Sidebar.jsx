import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import "./Sidebar.css";


/* ── SVG Icons ──────────────────────────────────────────────── */
const IconDashboard = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const IconFileText = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);

const IconBriefcase = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const IconUser = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

const IconLogOut = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);


/* ── Nav items config ────────────────────────────────────────── */
const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { to: "/resumes", label: "My Resumes", icon: <IconFileText /> },
    { to: "/jobs", label: "Job Tracker", icon: <IconBriefcase /> },
    { to: "/profile", label: "Profile", icon: <IconUser /> },
];


/* ══════════════════════════════════════════════════════════════
   Sidebar Component
   ══════════════════════════════════════════════════════════════ */
function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { showToast } = useToast();


    async function handleLogout() {
        try {
            await logout();
            showToast("Logged out successfully.", "success");
            navigate("/login", { replace: true });
        } catch {
            showToast("Unable to log out.", "error");
        }
    }


    return (
        <aside className="sidebar">

            {/* ── Brand ───────────────────────────────────── */}
            <div className="sidebar__brand">
                <div className="sidebar__logo" aria-hidden="true">
                    AR
                </div>

                <div className="sidebar__brand-text">
                    <h1>ResumeAI</h1>
                    <span>Analyzer</span>
                </div>
            </div>


            {/* ── Navigation ──────────────────────────────── */}
            <nav className="sidebar__nav" aria-label="Main navigation">

                <p className="sidebar__nav-label">Menu</p>

                {NAV_ITEMS.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar__link${isActive ? " active" : ""}`
                        }
                    >
                        <span className="sidebar__link-icon" aria-hidden="true">
                            {icon}
                        </span>
                        {label}
                    </NavLink>
                ))}

            </nav>


            {/* ── Footer ──────────────────────────────────── */}
            <div className="sidebar__footer">
                <button
                    type="button"
                    className="sidebar__logout"
                    onClick={handleLogout}
                >
                    <span className="sidebar__logout-icon" aria-hidden="true">
                        <IconLogOut />
                    </span>
                    Logout
                </button>

                <p className="sidebar__version">ResumeAI v1.0</p>
            </div>

        </aside>
    );
}

export default Sidebar;