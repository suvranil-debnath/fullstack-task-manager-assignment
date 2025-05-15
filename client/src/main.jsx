import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

export const server = "https://fullstack-task-manager-assignment.onrender.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
