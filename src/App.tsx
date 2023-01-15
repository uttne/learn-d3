import { useState } from "react";
import "./App.css";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { L001 } from "./pages/L001";

function App() {
  return (
    <Grid2 className="App" container spacing={0}>
      <Grid2 xs={2} className="nav"></Grid2>
      <Grid2 xs={10} className="body">
        <L001 />
      </Grid2>
    </Grid2>
  );
}

export default App;
