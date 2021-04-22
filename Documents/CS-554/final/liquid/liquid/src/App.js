import React from "react";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="header">
        <header>
          <img
            src="liquidLogoSmall.png"
            height="100px"
            width="200px"
            alt="Liquid Logo"
          />
        </header>
      </div>
      <br />
      <br />
      {
        <div className="App-body">
          <Route exact path="/" component={Home} />
        </div>
      }
      <script src="tota11y.min.js"></script>
    </Router>
  );
};

export default App;
