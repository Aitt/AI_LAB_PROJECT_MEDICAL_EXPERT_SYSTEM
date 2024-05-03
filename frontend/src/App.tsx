import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginUser from "./pages/AuthUser/loginUser";
import RegisterUser from "./pages/AuthUser/registerUser";

import LoginAdmin from "./pages/AuthAdmin/loginAdmin";
import RegisterAdmin from "./pages/AuthAdmin/registerAdmin";

import Home from "./pages/home/home";
import Knowledges from "./pages/knowledge";

import CreateRulesPage from "./pages/rule/createRule";
import CreateFact from "./pages/fact/createFact";

import ChatsAdmin from "./pages/ChatsAdmin";
import { UpdateRule } from "./service/https";

function App() {
  const token = localStorage.getItem("token");
  const result = localStorage.getItem("result");

  if (token) {
    console.log(result)
    if (result === "user") {
      return (
        <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      );
    }
    if (result === "admin") {
      return (
        <Router>
          <Routes>
            <Route path="/loginAdmin" element={<Navigate to="/knowledge" />} />
            <Route path="/chats" element={<ChatsAdmin />} />
            <Route path="/knowledge" element={<Knowledges />} />
            <Route path="/createRule/:id"element={<CreateRulesPage />}/>
            <Route path="/createFact/:id"element={<CreateFact />}/>
          </Routes>
        </Router>
      );
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={< LoginUser />} />
        <Route path="/user" element={< LoginUser />} />
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/regisuser" element={<RegisterUser />} />
        <Route path="/regisadmin" element={<RegisterAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;