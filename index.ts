import express from 'express';
import packagesRoutes from './routes/package.routes';
import pricesRoutes from './routes/price.routes';
import { sequelizeConnection } from './db/config';
import { seedDb } from './db/seed';
import { logError, logInfo } from './utils/logger';

// TODO: Use config file for all configuration and import here
const port = process.env.PORT || 3000;

export const app = express();

app.use(express.json());

app.use('/api/packages', packagesRoutes);
app.use('/api/prices', pricesRoutes);

app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: express.NextFunction
    ) => {
        logError('Unhandled error', {
            message: err.message,
            stack: err.stack,
        });
        res.status(500).json({ error: 'Internal server error' });
    }
);

const startServer = async () => {
    try {
        await sequelizeConnection.sync({ force: true });
        await seedDb();
        logInfo('Database synced and seeded');

        const server = app.listen(port, () => {
            logInfo(`Hemnet application running on port ${port}`);
        });

        const shutdown = async () => {
            logInfo('Shutting down...');
            server.close(async () => {
                await sequelizeConnection.close();
                logInfo('Database connection closed');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (err) {
        logError('Failed to start server', { error: err });
        process.exit(1);
    }
};

startServer();
