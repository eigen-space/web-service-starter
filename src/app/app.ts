/* eslint-disable no-console */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Socket } from 'net';
import { environment } from '../environments/environment';
import { IssueRouter } from './common/routers/issue.router';
import * as http from 'http';

export class Server {
    private app = express();
    private port = 3080;
    private connections: Socket[] = [];
    private server: http.Server;

    start(): void {
        this.app.use(async (_, res: express.Response, next: express.NextFunction) => {
            // Enable CORS
            res.set('Access-Control-Allow-Origin', '*');
            next();
        });
        this.app.use(express.json({ limit: '10mb', extended: true } as bodyParser.OptionsJson));
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.get('/', (_, res: express.Response) => res.send('Hi! This is service!'));

        this.app.use(environment.apiUrls.issues.base, IssueRouter);

        this.server = this.app.listen(this.port, '0.0.0.0', () => console.log(`app listening on port ${this.port}!`));

        process.on('SIGTERM', this.shutDown);
        process.on('SIGINT', this.shutDown);

        this.server.on('connection', (connection: Socket) => {
            this.connections.push(connection);
            connection.on('close', () => this.connections = this.connections.filter(curr => curr !== connection));
        });

        // Solve 'possible EventEmitter memory leak detected'
        process.setMaxListeners(0);
    }

    private async shutDown(): Promise<void> {
        this.server.close(() => {
            console.log('Closed out remaining connections');
            process.exit(0);
        });

        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);

        this.connections.forEach(curr => curr.end());
        setTimeout(() => this.connections.forEach(curr => curr.destroy()), 5000);
    }
}