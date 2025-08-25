import { type Request, type Response } from 'express';
import PriceService from '../services/price.service';
import { logError } from '../utils/logger';

export default {
    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const { packageName, year, municipality } = req.query as {
                packageName?: string;
                year?: number;
                municipality?: string;
            };

            if (!packageName || !year) {
                return res.status(400).json({
                    error: 'packageName and year are required query params',
                });
            }

            const history = await PriceService.getPriceHistory(
                packageName,
                year,
                municipality
            );

            return res.json({ history });
        } catch (err) {
            logError('Error fetching price history:', { error: err });
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
};
