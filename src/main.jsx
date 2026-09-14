import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import brand from './config/brand'
import './styles/brand-notimaginingit.css'

// Stamp the active brand on <html> before first paint so the brand stylesheet
// applies immediately and nothing flashes in the wrong identity.
document.documentElement.setAttribute('data-brand', brand.id)

// Consumer brand gets its own document title and description. Nexus keeps the
// values already in index.html.
if (brand.isConsumerBrand) {
  document.title = `${brand.name} — ${brand.tagline}`
  const description = document.querySelector('meta[name="description"]')
  if (description) {
    description.setAttribute(
      'content',
      'Turn what you have been noticing into a clear one-page summary you can hand to your doctor.'
    )
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
