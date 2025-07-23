import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MangaProvider } from './context/MangaContext.tsx'
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <MangaProvider>
         <App />
      </MangaProvider>
    </BrowserRouter>
  </StrictMode>,
)
