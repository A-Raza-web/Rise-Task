// src/App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import About from "./components/About";
import Contact from "./components/Contact";
import MyNavbar from "./components/MyNavbar";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-task" element={<TaskForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={
          <>
            <TaskForm />
            <TaskList />
          </>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings setDarkMode={setDarkMode} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
