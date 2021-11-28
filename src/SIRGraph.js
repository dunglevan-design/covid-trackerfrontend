import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./SIRGraph.css";
const options = {
    
  plugins: {
    legend: {
      display: true,
      labels: {
         color: "#fff"
      }
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
  responsive: true,
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
      },
    },
  },
};
const SIRGraph = ({ DateList, S, I, R }) => {
  const [Sdata, setSdata] = useState([]);
  const [Idata, setIdata] = useState([]);
  const [Rdata, setRdata] = useState([]);

  const BuildChartData = (datelist, datas) => {
    let chartData = [];
    if (typeof datelist === "undefined" || typeof datas === "undefined") {
      return chartData;
    }
    datelist.forEach((date, index) => {
      let newDataPoint = {
        x: date,
        y: datas[index],
      };
      chartData.push(newDataPoint);
    });
    return chartData;
  };

  useEffect(() => {
    console.log("effect runs");
    const newSdata = BuildChartData(DateList, S);
    const newIdata = BuildChartData(DateList, I);
    const newRdata = BuildChartData(DateList, R);

    setSdata(newSdata);
    setIdata(newIdata);
    setRdata(newRdata);
  }, [DateList, S, I, R]);
  return (
    <div className="SIR__Graph">
      {Sdata.length > 0 && (
        <Line
          data={{
            
            datasets: [
              {
                label: "R",
                borderColor: "#CC1034",
                data: Rdata,
                // fill: true,
                backgroundColor: "#CC1034",
                tension: 0.2,
                yAxisID: "y",
                xAxisID: "x",
              },
              {
                label: "S",
                borderColor: "#ADFF2F",
                backgroundColor: "#ADFF2F",
                data: Sdata,
                tension: 0.2,
                yAxisID: "y",
                xAxisID: "x",
              },
              {
                label: "I",
                borderColor: "#25E358",
                backgroundColor: "#25E358",
                data: Idata,
                tension: 0.2,
                yAxisID: "y",
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default SIRGraph;
