import React from "react";
import './App.css'
import Posts from "./Components/Posts";
import Users from "./Components/Users";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1 style={{ margin: "2rem", textAlign: "center" }}>Implementimi i GraphQL ne anen e klientit</h1>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </div>

  );
}
export default App;
