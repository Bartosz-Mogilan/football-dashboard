import React from "react";
import './DataTable.css';

function DataTable({ data }) {
    return (
        <div className="data-table">
            <h2>Match Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Team</th>
                        <th>Goals</th>
                        <th>Assists</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.team}</td>
                            <td>{item.goals}</td>
                            <td>{item.assists}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export default DataTable;