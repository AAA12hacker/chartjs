import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import data from "./data";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = () => {
  const [selectedScope, setSelectedScope] = useState("Scope 1");
  const [selectedYears, setSelectedYears] = useState(["2021", "2023"]);

  const uniqueYears = [...new Set(data.map((item) => item.year))].sort();
  const uniqueScopes = [...new Set(data.map((item) => item.scope))].sort();

  const filteredData = data.filter(
    (item) =>
      item.scope === selectedScope &&
      item.year >= selectedYears[0] &&
      item.year <= selectedYears[1]
  );

  const volumes = uniqueYears.map((year) =>
    filteredData
      .filter((item) => item.year === year)
      .reduce((sum, item) => sum + item.volume, 0)
  );

  const CO2esData = uniqueYears.map((year) =>
    filteredData
      .filter((item) => item.year === year)
      .reduce((sum, item) => sum + item.CO2e, 0)
  );

  const chartData = {
    labels: uniqueYears,
    datasets: [
      {
        label: "CO2e",
        data: CO2esData,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        stack: "Stack 0",
      },
      {
        label: "Volume",
        data: volumes,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        stack: "Stack 0",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Chart for Scope ${selectedScope}`,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const handleScopeChange = (e) => {
    setSelectedScope(e.target.value);
  };

  const handleYearChange = (e) => {
    const [start, end] = e.target.value.split("-");
    setSelectedYears([start, end]);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: "20px",
      }}
    >
      <div style={{ width: "90%", maxWidth: "800px" }}>
        <h2 style={{ textAlign: "center" }}>EdenSeven Task</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ marginRight: "20px" }}>
            <label>Select Scope: </label>
            <select onChange={handleScopeChange} value={selectedScope}>
              {uniqueScopes.map((scope) => (
                <option key={scope} value={scope}>
                  {scope}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Year Range: </label>
            <select
              onChange={handleYearChange}
              value={`${selectedYears[0]}-${selectedYears[1]}`}
            >
              {uniqueYears.map((startYear, index) =>
                uniqueYears.slice(index + 1).map((endYear) => (
                  <option
                    key={`${startYear}-${endYear}`}
                    value={`${startYear}-${endYear}`}
                  >
                    {startYear} - {endYear}
                  </option>
                ))
              )}

              <option
                value={`${uniqueYears[0]}-${
                  uniqueYears[uniqueYears.length - 1]
                }`}
              >
                All Years
              </option>
            </select>
          </div>
        </div>

        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StackedBarChart;
