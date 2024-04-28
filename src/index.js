import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PortfolioPage from "./portfolio/PortfolioPage";
import RainWorldlePage from "./rainworldle/RainWorldlePage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route exact path="/" element={<PortfolioPage/>}/>
              <Route path="/rainworldle" element={<RainWorldlePage/>}/>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
