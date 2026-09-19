import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import brand from './config/brand'
import './styles/brand-notimaginingit.css'
import './styles/brand-notimaginingit-warm.css'

// Stamp the active brand on <html> before first paint so the brand stylesheet
// applies immediately and nothing flashes in the wrong identity.
document.documentElement.setAttribute('data-brand', brand.id)

// Consumer brand gets its own document title and description. Nexus keeps the
// values already in index.html.
if (brand.isConsumerBrand) {
  // Results kept in this browser during checkout are removed once they are more
  // than a day old, on whichever page the visitor opens (see the privacy policy).
  try {
    const saved = JSON.parse(localStorage.getItem('nii_pending_results') || 'null')
    if (saved && Date.now() - (saved.savedAt || 0) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('nii_pending_results')
    }
  } catch {
    // Storage blocked or unreadable: nothing to clean up.
  }

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
