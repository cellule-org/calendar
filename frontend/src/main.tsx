import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router'
import './i18n/config';

import './index.css'
import { ThemeProvider } from '@/components/theme-provider';
import { WebSocketProvider } from '@/lib/websocket-context';

const currentUrl = window.location.href
const wsUrl = currentUrl.replace('http', 'ws').replace('https', 'wss')

const websocketConfig = {
    url: wsUrl,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    autoConnect: true,
}

const handleGlobalMessage = (data: any) => {
    console.log("Message global", data)
}

createRoot(document.getElementById('root')!).render(
    <WebSocketProvider
        config={websocketConfig}
        onMessage={handleGlobalMessage}
        onOpen={(event) => console.log("WebSocket connecté", event)}
        onError={(event) => console.error("Erreur WebSocket", event)}
    >
        <ThemeProvider>
            <Routes />
        </ThemeProvider>
    </WebSocketProvider>
)
