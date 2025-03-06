import React, { useState, useEffect } from 'react';
import Charts from './Charts';
import './Dashboard.css';

function Dashboard() {

    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);

    const [activeTab, setActiveTab] = useState('teams');

    const [chartMetric, setChartMetric] = useState('goals');

    const token = process.env.JWT_TOKEN;

  useEffect(() => {
    async function fetchData() {
        try {
            const [teamsRes, playerRes, matchesRes, statsRes] = await Promise.all([
                fetch('http://localhost:5000/teams', { headers: { 'Authorization': `Bearer ${token}`}}),
                fetch('http://localhost:5000/players', { headers: { 'Authorization': `Bearer ${token}`}}),
                fetch('http://localhost:5000/matches', { headers: { 'Authorization': `Bearer ${token}`}}),
                fetch('http://localhost:5000/player_stats', { headers: { 'Authorization': `Bearer ${token}`}}),
            ]);

            const teamsData = await teamsRes.json();
            const playersData = await playerRes.json();
            const matchesData = await matchesRes.json();
            const statsData = await statsRes.json();

            setTeams(teamsData);
            setPlayers(playersData);
            setMatches(matchesData);
            setPlayerStats(statsData);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }
    fetchData();
        }, []);

const renderTabContent = () => {
    switch (activeTab) {
        case 'teams':
            return (
                <div className='tab-section'>
                    <h2>Teams</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Abbreviation</th>
                                <th>Founded Year</th>
                                <th>Stadium</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map(team => {
                                <tr key={team.id}>
                                    <td>{team.id}</td>
                                    <td>{team.name}</td>
                                    <td>{team.abbreviation}</td>
                                    <td>{team.founded_year}</td>
                                    <td>{team.stadium}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            );
        case 'players':
            return (
                <div className='tab-section'>
                    <h2>Players</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Team ID</th>
                                <th>Position</th>
                                <th>Date of Birth</th>
                                <th>Nationality</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => {
                                <tr key={player.id}>
                                    <td>{player.id}</td>
                                    <td>{player.name}</td>
                                    <td>{player.team_id}</td>
                                    <td>{player.position}</td>
                                    <td>{player.date_of_birth}</td>
                                    <td>{player.nationality}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            );
            case 'matches':
                return (
                    <div className='tab-section'>
                        <h2>Matches</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Match Date</th>
                                    <th>Home Team ID</th>
                                    <th>Away Team ID</th>
                                    <th>Home Score</th>
                                    <th>Away Score</th>
                                    <th>Venue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map(match => {
                                    <tr key={match.id}>
                                        <td>{match.id}</td>
                                        <td>{match.match_date}</td>
                                        <td>{match.home_team_id}</td>
                                        <td>{match.away_team_id}</td>
                                        <td>{match.home_score}</td>
                                        <td>{match.away_score}</td>
                                        <td>{match.venue}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                );
                case 'playerStats':
                    return (
                        <div className='tab-section'>
                            <h2>Player Stats</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Player</th>
                                        <th>Goals</th>
                                        <th>Assists</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playerStats.map(stat => {
                                        <tr key={stat.id}>
                                            <td>{stat.id}</td>
                                            <td>{stat.player_name}</td>
                                            <td>{stat.goals}</td>
                                            <td>{stat.assists}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                    case 'chart':
                        return (
                            <div className='tab-section'>
                                <div className='chart-controls'>
                                    <label htmlFor='metric-select'>Chart Metric:</label>
                                    <select id='metric-select' value={chartMetric} onChange={(e) => setChartMetric(e.target.value)}>
                                        <option value='goals'>Goals</option>
                                        <option value='assists'>Assists</option>
                                        <option value='combined'>Combined</option>
                                    </select>
                                </div>
                                <Charts data={playerStats} chartMetric={chartMetric} />
                            </div>
                        );
                        default:
                            return <div>Select a tab to view data</div>
    }
};

return (
    <div className='dashboard'>
        <div className='tab-navigation'>
            <button onClick={() => setActiveTab('teams')} className={activeTab === 'teams' ? 'active': ''}>Teams</button>
            <button onClick={() => setActiveTab('players')} className={activeTab === 'players' ? 'active': ''}>Players</button>
            <button onClick={() => setActiveTab('matches')} className={activeTab === 'matches' ? 'active': ''}>Matches</button>
            <button onClick={() => setActiveTab('playerStats')} className={activeTab === 'playerStats' ? 'active': ''}>Player Stats</button>
            <button onClick={() => setActiveTab('chart')} className={activeTab === 'chart' ? 'active' : ''}>Top 10 Chart</button>
        </div>
        <div className='content'>
            {renderTabContent()}
        </div>
    </div>
);
}


export default Dashboard;

