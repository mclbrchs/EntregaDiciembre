import logo from "./logo.svg";
import "./App.css";
import Finder from "./pages/finder";
import React, { useState } from "react";

function App() {
  const [showHistory, setShowHistory] = useState(false);
  return (
    <div className="App">
      <div>Git App</div>
      <Finder showHistory={showHistory} setShowHistory={setShowHistory} />
    </div>
  );
}

export default App;
