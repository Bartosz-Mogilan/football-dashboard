import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import './Charts.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Charts({ data, chartMetric }) {
  let sortedData = [...data];
  if (chartMetric === 'combined') {
    sortedData.sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists));
  } else {
    sortedData.sort((a, b) => (b[chartMetric] || 0) - (a[chartMetric] || 0));
  }
  
  const topData = sortedData.slice(0, 10);
  const labels = topData.map(item => item.player_name);
  const metricValues = topData.map(item => {
    if (chartMetric === 'combined') {
      return (item.goals || 0) + (item.assists || 0);
    }
    return item[chartMetric] || 0;
  });
  
  const labelText = chartMetric === 'combined'
    ? 'Combined (Goals + Assists)'
    : chartMetric.charAt(0).toUpperCase() + chartMetric.slice(1);

  const chartData = {
    labels,
    datasets: [
      {
        label: labelText,
        data: metricValues,
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="charts-section">
      <h2>Top 10 Players - {labelText}</h2>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default Charts;

