import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(28, 28, 30, 0.95)',
            color: '#e5e5ea',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            fontFamily: 'Rajdhani, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: '#0a0a0c',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff0066',
              secondary: '#0a0a0c',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
