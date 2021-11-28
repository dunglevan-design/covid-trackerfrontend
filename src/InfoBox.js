import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, onClick }) {
  return (
    <Card onClick = {onClick} className={`infoBox ${active && "infoBox--selected"} ${
      isRed && "infoBox--red"
    }`}> 
      <CardContent>
        <Typography color = "textPrimary" gutterBottom fontSize={14}>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>

        <Typography color = "textSecondary" className="infoBox__total">
          {total}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
