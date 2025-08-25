import { sequelizeConnection } from '../db/config';
import { Municipality, PackageMunicipality } from '../models';
import { Package } from '../models/package';
import { Price } from '../models/price';

export default {
    async getAll() {
        return await Package.findAll({
            include: [{ model: Price, as: 'prices' }],
        });
    },

    async updatePackagePrice(
        pack: Package,
        newPriceCents: number,
        municipalityName?: string,
        date?: Date
    ) {
        return await sequelizeConnection.transaction(async (t) => {
            const priceDate = date ?? new Date();

            if (!municipalityName) {
                // Global price update

                if (pack.priceCents === newPriceCents) {
                    return pack; // For idempotancy
                }

                await Price.create(
                    {
                        packageId: pack.id,
                        priceCents: newPriceCents,
                        createdAt: priceDate,
                    },
                    { transaction: t }
                );

                pack.priceCents = newPriceCents;
                return pack.save({ transaction: t });
            }

            // Municipality-specific price update
            const municipality = await Municipality.findOne({
                where: { name: municipalityName },
                transaction: t,
            });

            if (!municipality) {
                throw new Error(
                    `Municipality "${municipalityName}" does not exist`
                );
            }

            let pkgMun = await PackageMunicipality.findOne({
                where: { packageId: pack.id, municipalityId: municipality.id },
                transaction: t,
            });

            if (!pkgMun) {
                pkgMun = await PackageMunicipality.create(
                    {
                        packageId: pack.id,
                        municipalityId: municipality.id,
                        priceCents: newPriceCents,
                    },
                    { transaction: t }
                );

                await Price.create(
                    {
                        packageId: pack.id,
                        municipalityId: municipality.id,
                        priceCents: newPriceCents,
                        createdAt: priceDate,
                    },
                    { transaction: t }
                );

                return pkgMun;
            }

            if (pkgMun.priceCents === newPriceCents) {
                return pkgMun; // Idempotency
            }

            await Price.create(
                {
                    packageId: pack.id,
                    municipalityId: municipality.id,
                    priceCents: newPriceCents,
                    createdAt: priceDate,
                },
                { transaction: t }
            );

            pkgMun.priceCents = newPriceCents;
            return pkgMun.save({ transaction: t });
        });
    },

    async priceFor(packageName: string, municipalityName: string) {
        const pack = await Package.findOne({
            where: { name: packageName },
        });

        if (!pack) {
            return null;
        }

        const municipality = await Municipality.findOne({
            where: { name: municipalityName },
        });

        if (!municipality) {
            return pack.priceCents;
        }

        const pkgMun = await PackageMunicipality.findOne({
            where: { packageId: pack.id, municipalityId: municipality.id },
        });

        if (pkgMun) {
            return pkgMun.priceCents;
        }

        return pack.priceCents;
    },

    // TODO: add priceForMunicipality which shows all packages prices in certain municipality
};
