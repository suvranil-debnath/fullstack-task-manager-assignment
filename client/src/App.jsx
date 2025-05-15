import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ToDoList from './ToDoList';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme || 'system';
    }
    return 'light';
  });

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    localStorage.theme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <Router>
        <div className="flex justify-end p-3 space-x-2">
  <button
    onClick={() => setTheme('light')}
    className={`p-2 rounded-full text-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition ${
      theme === 'light' ? 'bg-gray-300 dark:bg-gray-700' : ''
    }`}
    title="Light Mode"
  >
    ☀️
  </button>
  <button
    onClick={() => setTheme('dark')}
    className={`p-2 rounded-full text-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition ${
      theme === 'dark' ? 'bg-gray-300 dark:bg-gray-700' : ''
    }`}
    title="Dark Mode"
  >
    🌙
  </button>
  <button
    onClick={() => setTheme('system')}
    className={`p-2 rounded-full text-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition ${
      theme === 'system' ? 'bg-gray-300 dark:bg-gray-700' : ''
    }`}
    title="System Default"
  >
    🖥️
  </button>
</div>

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/todo" element={<ToDoList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
