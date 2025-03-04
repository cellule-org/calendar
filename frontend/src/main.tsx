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

const handleGlobalMessage = (_data: any) => {
    //console.log("Message global", data)
}

const handleLoadEvents = (data: any) => {
    if (data.type === 'load_events') {
        const event = new CustomEvent('loadEvents', { detail: data.events });
        window.dispatchEvent(event);
    } else if (data.type === 'event_added') {
        const event = new CustomEvent('eventAdded', { detail: data.event });
        window.dispatchEvent(event);
    } else if (data.type === 'event_removed') {
        const event = new CustomEvent('eventRemoved', { detail: data.id });
        window.dispatchEvent(event);
    }
}

createRoot(document.getElementById('root')!).render(
    <WebSocketProvider
        config={websocketConfig}
        onMessage={(data) => {
            handleGlobalMessage(data);
            handleLoadEvents(data);
        }}
        onOpen={(event) => console.log("WebSocket connecté", event)}
        onError={(event) => console.error("Erreur WebSocket", event)}
    >
        <ThemeProvider>
            <Routes />
        </ThemeProvider>
    </WebSocketProvider>
)
