import React from "react";
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
}

export default App;
