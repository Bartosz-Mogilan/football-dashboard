import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import Charts from './Charts';
import Filters from './Filters';
import DataTable from './DataTable';
import './Dashboard.css';

function Dashboard() {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({team: '', season: ''});

    useEffect(() => {
        const dummyData = [
            { id: 1, team: 'Team A, goals: 10, assists: 5 '},
            { id: 2, team: 'Team B, goals: 15, assists: 8 '},
        ];
        setData(dummyData);
    }, [filters]);

    const handleFilterChange = (newFilter) => {
        setFilters(newFilter);
    }

    return (
        <div className='dashboard'>
            <Filters filters={filters} onFilterChange={handleFilterChange} />
            <StatsCards data={data} />
            <Charts data={data} />
            <DataTable data={data} />
        </div>
    );
}

export default Dashboard;