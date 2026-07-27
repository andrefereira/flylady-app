import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Registra o service worker do PWA. Com registerType: 'autoUpdate', uma
// nova versão do app é aplicada sozinha assim que o usuário reabrir/atualizar
// a página, sem precisar de nenhuma ação manual.
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
