import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import path from 'path';
import WebSocket from 'ws';
import fs from 'fs';

const app = express();
const server = createServer(app);

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


const messageHandler = (ws: WebSocket, message: string) => {
    console.log('Received:', message);
    ws.send(`Received: ${message}`);
}

const start = async () => {
    try {
        const wss = new WebSocket.Server({ port: process.env.CORE_PORT ? parseInt(process.env.CORE_PORT) : 3000 });

        wss.on('connection', (ws) => {
            ws.send(JSON.stringify({ message: 'Connected to WebSocket server' }));

            ws.on('message', (message) => {
                messageHandler(ws, message.toString());
            });

            ws.on('close', () => {
                console.log('WebSocket connection closed');
            });
        });

        server.listen(3001, () => {
            console.log('Server is running on http://localhost:3001');
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();