import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router'
import './i18n/config';

import './index.css'
import { ThemeProvider } from '@/components/theme-provider';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <Routes />
    </ThemeProvider>
)
