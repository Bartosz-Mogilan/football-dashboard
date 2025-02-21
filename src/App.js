import React from "react";
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
}

export default App;
