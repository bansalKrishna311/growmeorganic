import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// PrimeReact styles (theme, core, icons)
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
// PrimeFlex utilities (optional but used by some layouts)
import 'primeflex/primeflex.css';

import { PrimeReactProvider } from 'primereact/api';

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
