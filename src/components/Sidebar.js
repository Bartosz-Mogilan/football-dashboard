import React from "react";
import './Sidebar.css';

function SideBar() {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li>Overview</li>
                    <li>Team Stats</li>
                    <li>Player Stats</li>
                    <li>Match History</li>
                    <li>Analytics</li>
                </ul>
            </nav>
        </aside>
    );
}

export default SideBar;