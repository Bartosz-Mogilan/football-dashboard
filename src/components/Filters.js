import React from "react";
import './Filters.css';

function Filters({ filters, onFilterChange }) {
    const handleTeamChange = (e) => {
        onFilterChange({ ...filters, team: e.target.value});
    };

    const handleSeasonChange = (e) => {
        onFilterChange({ ...filters, season: e.target.value});
    };
    
    return (
        <div className="filters">
            <label>
                Team:
                <input
                type="text"
                value={filters.team}
                onChange={handleTeamChange}
                placeholder="Enter team"
                />
            </label>
            <label>
                Season:
                <input 
                type="text"
                value={filters.season}
                onChange={handleSeasonChange}
                placeholder="Enter season"
                />
            </label>
        </div>
    );
}

export default Filters;