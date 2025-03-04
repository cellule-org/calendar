import { createContext, useContext, ReactNode } from "react"
import { useWebSocket } from "./use-web-socket"

// Type pour les options de configuration du WebSocket
export interface WebSocketProviderConfig {
  url: string
  reconnectAttempts?: number
  reconnectInterval?: number
  protocols?: string | string[]
  autoConnect?: boolean
}

// Type pour le contexte
interface WebSocketContextType {
  status: "connecting" | "open" | "closing" | "closed" | "error"
  messages: any[]
  sendMessage: (message: string | { type: string; data: any }) => boolean
  connect: () => void
  disconnect: () => void
  getWebSocket: () => WebSocket | null
}

// Création du contexte avec une valeur par défaut
const WebSocketContext = createContext<WebSocketContextType | null>(null)

// Hook personnalisé pour utiliser le contexte WebSocket
export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocketContext doit être utilisé à l'intérieur d'un WebSocketProvider")
  }
  return context
}

// Props pour le provider
interface WebSocketProviderProps {
  children: ReactNode
  config: WebSocketProviderConfig
  onMessage?: (data: any) => void
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
}

// Composant Provider qui utilise notre hook useWebSocket
export function WebSocketProvider({
  children,
  config,
  onMessage,
  onOpen,
  onClose,
  onError,
}: WebSocketProviderProps) {
  const webSocket = useWebSocket({
    url: config.url,
    reconnectAttempts: config.reconnectAttempts,
    reconnectInterval: config.reconnectInterval,
    protocols: config.protocols,
    autoConnect: config.autoConnect,
    onMessage,
    onOpen,
    onClose,
    onError,
  })

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  )
}
