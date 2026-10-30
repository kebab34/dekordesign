import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './motion/motion.css'
import './i18n/index.js'

// Les balises SEO pré-générées dans le HTML (scripts/seo/build-seo.mjs) servent aux robots et aux aperçus
// de partage ; une fois l'application lancée, React Helmet pose les siennes : on retire les anciennes pour éviter les doublons.
document.querySelectorAll('head [data-rh]').forEach(el => el.remove())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)