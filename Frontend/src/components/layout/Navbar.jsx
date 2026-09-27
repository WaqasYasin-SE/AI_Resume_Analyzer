import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
    const { user } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar__title">
                <h2>Dashboard</h2>
            </div>

            <div className="navbar__user">
                <div className="navbar__avatar">
                    {user?.full_name
                        ?.charAt(0)
                        ?.toUpperCase()}
                </div>

                <div className="navbar__user-info">
                    <span className="navbar__name">
                        {user?.full_name}
                    </span>

                    <span className="navbar__email">
                        {user?.email}
                    </span>
                </div>
            </div>
        </header>
    );
}

export default Navbar;