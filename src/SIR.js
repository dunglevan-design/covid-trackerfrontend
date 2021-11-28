import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Box, Button, Slider, Typography } from "@mui/material";
import SIRGraph from "./SIRGraph";
import { baseurl } from "./URL";

const SIR = ({ Country, population }) => {
  const [alpha, setAlpha] = useState(0.0001);
  const [I0, setI0] = useState(0);
  const [R0, setR0] = useState(0);
  const [trueInfected, settrueInfected] = useState([]);
  const [trueRecovered, settrueRecovered] = useState([]);
  const [startDate, setstartDate] = useState("7/24/21");
  const [Beta, setBeta] = useState(0.05);
  const [Gamma, setGamma] = useState(0.06);
  const [DateList, setDateList] = useState([]);
  const [solution, setsolution] = useState({});
  const S0 = Country === "worldwide" ? 5000 : population * alpha * 0.4;
  const isFirstRun = useRef(true);

  const fitSIRParameters = async () => {
    //POST to solveSIR.
  };

  const solveSIR = async (
    S_0,
    R_0,
    I_0,
    trueInfected,
    trueRecovered,
    Beta,
    Gamma,
    startDate
  ) => {
    const url = `${baseurl}/SIRsolver/solve`;
    const formdata = new FormData();
    formdata.append("S0", S_0);
    formdata.append("I0", I_0);
    formdata.append("R0", R_0);
    formdata.append("trueInfected", trueInfected);
    formdata.append("trueRecovered", trueRecovered);
    formdata.append("Beta", Beta);
    formdata.append("Gamma", Gamma);
    formdata.append("startDate", startDate);
    const data = await fetch(url, {
      method: "POST",
      body: formdata,
    }).then((response) => response.json());
    return data;
  };
  //setting initial values
  useEffect(() => {
    console.log("effect run");
    const url =
      Country === "worldwide"
        ? `https://disease.sh/v3/covid-19/historical/all?lastdays=all`
        : `https://disease.sh/v3/covid-19/historical/${Country}?lastdays=all`;

    console.log("url here: " + url);
    fetch(url)
      .then((response) => response.json())
      .then(async (responsedata) => {
        const formdata =
          Country === "worldwide" ? responsedata : responsedata.timeline;
        const Dates = Object.keys(formdata.cases);
        const StartDateIndex = Dates.findIndex((date) => date === startDate);

        const infected = Object.values(formdata.cases).map(
          (cases, i) =>
            cases -
            Object.values(formdata.deaths)[i] -
            Object.values(formdata.recovered)[i]
        );
        const trueRecovereddata = Object.values(formdata.recovered).slice(
          StartDateIndex,
          infected.length - 1
        );
        const trueInfecteddata = infected.slice(
          StartDateIndex,
          infected.length - 1
        );

        const newI0 =
          (formdata.cases[startDate] -
            formdata.deaths[startDate] -
            formdata.recovered[startDate]) *
          alpha;
        const newR0 = formdata.recovered[startDate] * alpha;
        console.log(S0, newI0, newR0);
        setDateList(Dates.slice(StartDateIndex, Dates.length - 1));
        settrueInfected(trueInfecteddata);
        settrueRecovered(trueRecovereddata);
        setI0(newI0);
        setR0(newR0); //plus deaths here if needed

        // const { S, I, R } = await solveSIR(
        //   S0,
        //   newI0,
        //   newR0,
        //   trueInfecteddata,
        //   trueRecovereddata,
        //   Beta,
        //   Gamma,
        //   startDate
        // );

        // setsolution({
        //     S: S,
        //     I: I,
        //     R: R,
        // })

        // console.log(S);
        // console.log(I);
        // console.log(R);
      });
  }, [Country]);

  useEffect(() => {
    console.log("Parameters chaanged, solving again ... ");
    solveSIR(
      S0,
      I0,
      R0,
      trueInfected,
      trueRecovered,
      Beta,
      Gamma,
      startDate
    ).then(({ S, I, R }) => {
      setsolution({
        S: S,
        I: I,
        R: R,
      });
    });
  }, [S0, R0, I0, trueInfected, trueRecovered, Beta, Gamma, startDate]);

  return (
    <div className="SIR">
      <div className="SIR__controls">
        <Box width={300}>
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
        <Box width = {300}>
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
      </div>
      <SIRGraph DateList={DateList} {...solution}></SIRGraph>
    </div>
  );
};

export default SIR;
