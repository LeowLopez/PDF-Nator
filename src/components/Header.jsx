import React from 'react';
import { FileUp, Sun, Moon } from 'lucide-react';

const Header = ({ isDarkMode, setIsDarkMode }) => (
  <header className="header">
    <div className="header-content">
      <div className="header-logo">
        <div className="logo-icon">
          <FileUp size={26} color="white" />
        </div>
        <h1 className="header-title">PDF-Nator</h1>
      </div>
      
      <div className="header-actions">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="btn btn-theme">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDarkMode ? 'Claro' : 'Escuro'}</span>
        </button>
      </div>
    </div>
  </header>
);

export default Header;