import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './lib/AuthContext'
import './styles.css'

const Router = import.meta.env.BASE_URL === '/PROMNEXA/' ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
)
