import "./App.css";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import Table from "./Table";
import "./Table.css";
import { sortData } from "./util";
import CaseGraph from "./CaseGraph";
import Map from "./Map";
import numeral from "numeral";
import SIR from "./SIR";
import TopCountriesBarGraph from "./TopCountriesBarGraph";

function App() {
  const [Countries, setCountries] = useState([]);
  const [Country, setInputCountry] = useState("worldwide");
  const [CountryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [exactData, setExactData] = useState({
    cases: 0,
    deaths: 0,
    recovered: 0,
  });

  useEffect(() => {
    const loadingscreen = document.querySelector(".loading__screen");
    loadingscreen.classList.add("fade-out");

  }, [])

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setmapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    const urlForExactData =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/historical/all"
        : `https://disease.sh/v3/covid-19/historical/${countryCode}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter([51.509865, -0.118092])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide" ? setMapZoom(3) : setMapZoom(4);
      });
    fetch(urlForExactData)
      .then((response) => response.json())
      .then((data) => {
        const dataCaseValues =
          countryCode === "worldwide"
            ? Object.values(data.cases)
            : Object.values(data.timeline.cases);
        const dataDeathsValues =
          countryCode === "worldwide"
            ? Object.values(data.deaths)
            : Object.values(data.timeline.deaths);
        const dataRecoveredValues =
          countryCode === "worldwide"
            ? Object.values(data.recovered)
            : Object.values(data.timeline.recovered);
        setExactData({
          cases: dataCaseValues[29] - dataCaseValues[28],
          deaths: dataDeathsValues[29] - dataDeathsValues[28],
          recovered: dataRecoveredValues[29] - dataRecoveredValues[28],
        });
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={Country}
              onChange={onCountryChange}
              size="small"
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {Countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            isRed
            active={casesType === "cases"}
            cases={
              Country === "worldwide"
                ? `+ ${numeral(CountryInfo.todayCases).format("0,0")}`
                : `+ ${numeral(exactData.cases).format("0,0")}`
            }
            total={numeral(CountryInfo.cases).format("0,0")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={
              Country === "worldwide"
                ? `+ ${numeral(CountryInfo.todayRecovered).format("0,0")}`
                : `+ ${numeral(exactData.recovered).format("0,0")}`
            }
            total={numeral(CountryInfo.recovered).format("0,0")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={
              Country === "worldwide"
                ? `+ ${numeral(CountryInfo.todayDeaths).format("0,0")}`
                : `+ ${numeral(exactData.deaths).format("0,0")}`
            }
            total={numeral(CountryInfo.deaths).format("0,0")}
          />
        </div>
        <h3 className = "table__header">Live cases by country</h3>
        <Table countries={tableData} />
          <Map
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
            casesType={casesType}
          />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Worldwide new cases</h3>
          <CaseGraph casesType={casesType} />
          <h3>SIR model</h3>
          <SIR></SIR>
          <h3>Top countries</h3>
          <TopCountriesBarGraph countries = {tableData.slice(0,5)}></TopCountriesBarGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
