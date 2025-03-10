import React from "react";
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="logo">Football Analytics Dashboard - Premier League 2023/2024</div>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <div className="user-profile">
                <button>Profile</button>
            </div>
        </header>
    )
}

export default Header;