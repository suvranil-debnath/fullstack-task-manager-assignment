import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme || 'system';
    }
    return 'light';
  });

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
    <div className="fixed top-4 right-4 flex gap-2">
      <button onClick={() => setTheme('light')} className="px-3 py-1 bg-gray-200 rounded dark:bg-gray-700">
        Light
      </button>
      <button onClick={() => setTheme('dark')} className="px-3 py-1 bg-gray-800 text-white rounded dark:bg-gray-300 dark:text-black">
        Dark
      </button>
      <button onClick={() => setTheme('system')} className="px-3 py-1 bg-blue-500 text-white rounded">
        System
      </button>
    </div>
  );
}
