import React from "react";
import './StatsCards.css';

function StatsCards ({ data }) {
    const totalGoals = data.reduce((acc, item) => acc + (item.goals || 0), 0);
    const totalAssists = data.reduce((acc, item) => acc + (item.assists || 0), 0);

    return (
        <div className="stats-cards">
            <div className="card">
                <h3>Total Goals</h3>
                <p>{totalGoals}</p>
            </div>
            <div className="card">
                <h3>Total Assists</h3>
                <p>{totalAssists}</p>
            </div>
        </div>
    );
}

export default StatsCards;