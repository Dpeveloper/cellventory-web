import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Products } from './pages/Products.tsx'
import { Sales } from './pages/Sales.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Products/>
  </StrictMode>,
)
