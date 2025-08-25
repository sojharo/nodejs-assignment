import { Package } from '../models/package';
import { Price } from '../models/price';
import { Municipality } from '../models/municipality';
import { Op } from 'sequelize';

export default {
    async getPriceHistory(
        packageName: string,
        year: number,
        municipalityName?: string
    ) {
        const pack = await Package.findOne({
            where: { name: packageName },
        });

        if (!pack) {
            return {};
        }

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        let municipalityId: number | undefined;
        if (municipalityName) {
            const municipality = await Municipality.findOne({
                where: { name: municipalityName },
            });

            if (!municipality) {
                return {};
            }

            municipalityId = municipality.id;
        }

        const prices = await Price.findAll({
            where: {
                packageId: pack.id,
                ...(municipalityId !== undefined ? { municipalityId } : {}),
                createdAt: { [Op.gte]: startDate, [Op.lt]: endDate },
            },
            include: [
                {
                    model: Municipality,
                    as: 'municipality',
                    attributes: ['name'],
                },
            ],
            order: [['createdAt', 'ASC']],
        });

        const result = prices.reduce<Record<string, number[]>>((acc, p) => {
            const key = p.municipality?.name ?? 'global';
            return {
                ...acc,
                [key]: [...(acc[key] ?? []), p.priceCents],
            };
        }, {});

        return result;
    },
};
