import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, HeartPulse, Camera, Droplets, MessageCircle } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home className="nav-icon" size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/health" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <HeartPulse className="nav-icon" size={24} />
        <span>Health</span>
      </NavLink>
      <NavLink to="/scan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Camera className="nav-icon" style={{transform: 'scale(1.2)'}} size={28} />
        <span>Scan</span>
      </NavLink>
      <NavLink to="/milk" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Droplets className="nav-icon" size={24} />
        <span>Milk</span>
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MessageCircle className="nav-icon" size={24} />
        <span>Helper</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
