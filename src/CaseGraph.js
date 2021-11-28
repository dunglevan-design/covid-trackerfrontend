import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./CaseGraph.css";
const options = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      intersect: false,
      callbacks: {
        label: function (context) {
          // console.log(JSON.stringify(context.dataset))
          return `+ ${context.dataset.data[context.datasetIndex].y}`;
        },
      },
    },
  },
  interaction: {
    mode: "index",
  },
  elements: {
    point: {
      radius: 1,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      // reverse: true,
      gridLines: {
        display: false,
      },
      // type: "time",
      time: {
        format: "MM/DD/YY",
        tooltipFormat: "ll",
      },
      ticks: {
        color: "#fff",
      },
    },
    y: {
      gridLines: {
        display: false,
      },

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
const CaseGraph = ({casesType}) => {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    const Dates = Object.keys(data.cases);
    Dates.forEach((date) => {
      if (lastDataPoint && data[casesType][date] !== 0) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    })


    //
  
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          // console.log(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType]);
  return (
    <div className="case__graph">
      {!Object.is(data, {}) && (
        <Line
          data={{
            datasets: [
              {
                borderColor: "#CC1034",
                data: data,
                fill: true,
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                tension: 0.2,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default CaseGraph;
