import { type Request, type Response } from 'express';
import PackageService from '../services/package.service';
import { logError } from '../utils/logger';

export default {
    async getAll(_: Request, response: Response) {
        try {
            const packages = await PackageService.getAll();

            // TODO: make it paginated in future
            response.json({ packages });
        } catch (err) {
            logError('Error fetching packages:', { error: err });
            response.status(500).json({ error: 'Internal server error' });
        }
    },
};
