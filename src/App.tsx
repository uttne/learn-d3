import { useState } from "react";
import "./App.css";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Home } from "./pages/Home";
import { L001 } from "./pages/L001";
import { L002 } from "./pages/L002";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Grid2 className="App" container spacing={0}>
        <Grid2 xs={2} className="nav">
          <Link to="/">Home</Link>
          <Link to="/001">001</Link>
          <Link to="/002">002</Link>
        </Grid2>
        <Grid2 xs={10} className="body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/001" element={<L001 />} />
            <Route path="/002" element={<L002 />} />
          </Routes>
        </Grid2>
      </Grid2>
    </BrowserRouter>
  );
}

export default App;
