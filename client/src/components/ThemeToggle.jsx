import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = savedTheme !== 'light'; // Default to dark unless explicitly set to light
    setIsDark(prefersDark);
    
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button 
      color="secondary"
      outline
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </Button>
  );
};

export default ThemeToggle;
