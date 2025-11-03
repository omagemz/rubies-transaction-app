import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = savedTheme === 'dark' || savedTheme === null;
    setIsDark(prefersDark);
    document.body.classList.toggle('light-mode', !prefersDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.body.classList.toggle('light-mode', !newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDark ? '🌙' : '☀️'}
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default ThemeToggle;
