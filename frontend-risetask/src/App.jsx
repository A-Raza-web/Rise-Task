import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";

import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import Home from "./components/Home";
import SchedulerPage from "./components/pages/SchedulerPage";
import AITaskForm from "./components/pages/AITaskForm";
import TeamTasksPage from "./components/pages/TeamTasksPage";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings";
import About from "./components/About";
import Contact from "./components/Contact";
import MyNavbar from "./components/MyNavbar";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <Router>
      <div className={darkMode ? "bg-dark text-white min-vh-100" : "bg-light text-dark min-vh-100"}>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-task" element={<TaskForm />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/scheduler" element={<SchedulerPage />} />
          <Route path="/ai-scheduler" element={<AITaskForm />} />
          <Route path="/team-tasks" element={<TeamTasksPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings setDarkMode={setDarkMode} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
