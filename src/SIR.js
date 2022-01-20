import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Box, Button, Slider, Typography } from "@mui/material";
import SIRGraph from "./SIRGraph";
import { baseurl } from "./URL";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import CircularProgress from "@mui/material/CircularProgress";

const SIR = () => {
  const [alpha, setAlpha] = useState(0.0001);
  const [I0, setI0] = useState(0.01);
  const S0 = 1 - I0;
  const [R0, setR0] = useState(0);
  const [size, setsize] = useState(120);
  const [startDate, setstartDate] = useState("7/24/21");
  const [Beta, setBeta] = useState(0.25);
  const [Gamma, setGamma] = useState(0.05);
  const [DateList, setDateList] = useState([]);
  const [solution, setsolution] = useState({});
  const firstload = useRef(true);
  const [loading, setLoading] = useState(true);

  function delay(time) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
    });
  }

  const solveSIR = async () => {
    const url = `${baseurl}/SIRsolver/solveode`;
    const formdata = new FormData();
    formdata.append("S0", S0);
    formdata.append("I0", I0);
    formdata.append("R0", R0);
    formdata.append("size", size);
    formdata.append("Beta", Beta);
    formdata.append("Gamma", Gamma);

    // await delay(5000);

    const data = await fetch(url, {
      method: "POST",
      body: formdata,
    }).then((response) => response.json());
    return data;
  };

  useEffect(() => {
    console.log("getting data .....");
    const url = "https://disease.sh/v3/covid-19/historical/all?lastdays=all";
    fetch(url)
      .then((response) => response.json())
      .then(async (formdata) => {
        const Dates = Object.keys(formdata.cases);
        const StartDateIndex = Dates.findIndex((date) => date === startDate);
        setsize(Dates.length - StartDateIndex);
        setDateList(Dates.slice(StartDateIndex, Dates.length - 1));
      });
  }, [startDate]);

  useEffect(() => {
    console.log("Parameters chaanged, solving again ... ");
    solveSIR().then(({ S, I, R }) => {
      setsolution({
        S: S,
        I: I,
        R: R,
      });
      if (firstload.current) {
        setLoading(false);
      }
      firstload.current = false;
    });
  }, [S0, R0, I0, Beta, Gamma]);

  return (
    <div className="SIR">
      <div className="container">
        <div className="SIR__controls">
          <Box width={100}>
            <Typography>Beta: </Typography>
            <Slider
              size="small"
              aria-label="Beta"
              valueLabelDisplay="auto"
              min={0.01}
              max={0.5}
              step={0.01}
              value={Beta}
              onChangeCommitted={(e, value) => setBeta(value)}
              color="primary"
            />
          </Box>
          <Box width={100}>
            <Typography>Gamma: </Typography>
            <Slider
              size="small"
              aria-label="Gamma"
              valueLabelDisplay="auto"
              min={0.01}
              max={0.5}
              step={0.01}
              value={Gamma}
              onChangeCommitted={(e, value) => setGamma(value)}
            />
          </Box>
          <Box width={100}>
            <Typography>I0: </Typography>
            <Slider
              size="small"
              aria-label=""
              valueLabelDisplay="auto"
              min={0.01}
              max={0.5}
              step={0.01}
              value={I0}
              onChangeCommitted={(e, value) => setI0(value)}
              color="primary"
            />
          </Box>
          <Box width={100}>
            <Typography>R0: </Typography>
            <Slider
              size="small"
              aria-label="Beta"
              valueLabelDisplay="auto"
              min={0.01}
              max={0.5}
              step={0.01}
              value={R0}
              onChangeCommitted={(e, value) => setR0(value)}
              color="primary"
            />
          </Box>
        </div>
        <div className="formula__container">
          <MathJaxContext>
            <MathJax className="formula">
              {"\\(\\frac{dS}{dt} = -{\\beta}{\\cdot}S{\\cdot}I\\)"}
            </MathJax>
            <MathJax className="formula">
              {
                "\\(\\frac{dI}{dt} = {\\beta}{\\cdot}S{\\cdot}I - {\\gamma}{\\cdot}I\\)"
              }
            </MathJax>
            <MathJax className="formula">
              {"\\(\\frac{dR}{dt} = {\\gamma}{\\cdot}I\\)"}
            </MathJax>
          </MathJaxContext>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <SIRGraph DateList={DateList} {...solution}></SIRGraph>
      )}
    </div>
  );
};

const Loading = () => {
  return (
    <div className="loading__overlay">
      <p>Sorry, backend host on Heroku Dyno ...</p>
      <CircularProgress color="secondary" />
    </div>
  );
};

export default SIR;
