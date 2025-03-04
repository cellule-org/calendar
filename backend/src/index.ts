import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import path from 'path';
import { WebSocket, WebSocketServer } from 'ws';
import fs from 'fs';

const app = express();
const server = createServer(app);

let core_ws: WebSocket | null = null;
let calendar_ws = null;

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Request error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
});

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get("/assets/:filename", (req: Request, res: Response) => {
    const { filename } = req.params;
    res.sendFile(path.join(__dirname, 'dist', 'assets', filename));
});

app.get("/locales/:lng/translation.json", (req: Request, res: Response) => {
    const { lng } = req.params;
    res.sendFile(path.join(__dirname, 'dist', 'locales', lng, 'translation.json'));
});

const messageHandler = (message: string) => {
    console.log('Received:', message);
}

const connectToWebSocketServer = async (url: string, retries: number = 50, delay: number = 3000): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
        const attempt = (retryCount: number) => {
            if (retryCount === 0) {
                return reject(new Error('Failed to connect to WebSocket server after multiple attempts'));
            }

            console.log(`Connecting to WebSocket server (attempt ${retries - retryCount + 1}/${retries})`);

            const ws = new WebSocket(url);

            ws.on('open', () => {
                console.log('Connected to WebSocket server');
                resolve(ws);
            });

            ws.on('error', (err) => {
                setTimeout(() => attempt(retryCount - 1), delay);
            });

            ws.on('close', () => {
                //console.log('WebSocket connection closed');
            });
        };

        attempt(retries);
    });
};

const createWebSocket = (handleIncomingMessage: (ws: WebSocketServer, message: string) => void) => {
    const ws = new WebSocketServer({ server });

    ws.on('connection', (ws) => {
        ws.on('message', handleIncomingMessage);
    });

    return ws;
}

const start = async () => {
    try {
        calendar_ws = createWebSocket((ws, message) => {
            ws.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
        core_ws = await connectToWebSocketServer(process.env.CORE_WS_URL || 'ws://core-app:3000');
        core_ws.send(JSON.stringify({
            type: "create",
            data: {
                id: "new_calendar_event",
                name: "New Calendar Event",
                public: false
            }
        }));

        core_ws.on('message', (message) => {
            messageHandler(message.toString());
        });
        core_ws.on('close', () => {
            console.log('WebSocket connection closed, clearing event and restarting...');
            if (core_ws) {
                core_ws.removeAllListeners();
            }
            server.close();
            start();
        });

        try {
            server.listen(3001, () => {
                console.log('Server is running on http://localhost:3001');
                console.log('WebSocket server is running on ws://localhost:3001');
            });
        } catch (err) {
            //Do nothing
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
