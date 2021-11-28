import React from "react";
import "./TopCountriesBarGraph.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import numeral from "numeral";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "#fff",
      },
    },
  },
  scales: {
    x: {
      // reverse: true,
      ticks: {
        color: "#fff",
      },
    },
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        color: "#25E35F",
        callback: function (value, index, values) {
          return numeral(value).format("0a");
        },
      },
    },
  },
};

const TopCountriesBarGraph = ({ countries }) => {
  const labels = ["USA", "India", "Brazil", "UK", "Russia"];
  const data = {
    labels,
    datasets: [
      {
        label: "Critical cases",
        data: labels.map((label, index) => countries[index]?.critical),
        backgroundColor: "#CC1034",
        borderColor: "#CC1034",
      },
    ],
  };
  const deathsdata = {
    labels,
    datasets: [
      {
        label: "Deaths",
        data: labels.map((label, index) => countries[index]?.deaths),
        backgroundColor: "#CC1034",
        borderColor: "#CC1034",
      },
    ],
  };
  return (
    <div className="container">
      {!!data && (
        <div className="bar__graph">
          <Bar options={options} data={data} />
        </div>
      )}
      {!!deathsdata && (
        <div className="bar__graph">
          <Bar options={options} data={deathsdata} />
        </div>
      )}
    </div>
  );
};

export default TopCountriesBarGraph;
