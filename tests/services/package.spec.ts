import { sequelizeConnection } from '../../db/config';
import { Municipality } from '../../models';
import { Package } from '../../models/package';
import { Price } from '../../models/price';
import PackageService from '../../services/package.service';

describe('PackageService', () => {
    // Set the db object to a variable which can be accessed throughout the whole test file
    const db = sequelizeConnection;
    const packageService = PackageService;

    // Before any tests run, clear the DB and run migrations with Sequelize sync()
    beforeEach(async () => {
        await db.sync({ force: true });
    });

    afterAll(async () => {
        await db.close();
    });

    it('Updates the current price of the provided package', async () => {
        const pack = await Package.create({
            name: 'Dunderhonung',
            priceCents: 0,
        });

        const newPackage = await packageService.updatePackagePrice(
            pack,
            200_00
        );

        expect(newPackage.priceCents).toBe(200_00);
    });

    it('Stores the old price of the provided package in its price history', async () => {
        const pack = await Package.create({
            name: 'Dunderhonung',
            priceCents: 100_00,
        });

        await packageService.updatePackagePrice(pack, 200_00);

        const priceHistory = await Price.findAll({
            where: { packageId: pack.id },
        });

        expect(priceHistory.length).toBe(1);
        expect(priceHistory[0].priceCents).toBe(100_00);
    });

    it('Supports adding a price for a specific municipality', async () => {
        const pack = await Package.create({
            name: 'Dunderhonung',
            priceCents: 0,
        });

        await Municipality.create({ name: 'Göteborg' });

        await packageService.updatePackagePrice(pack, 200_00, 'Göteborg');

        const response = await packageService.priceFor(pack.name, 'Göteborg');

        expect(response).toBe(200_00);
    });

    it('Does not create duplicate history entry when updating to the same price', async () => {
        const pack = await Package.create({
            name: 'Dunderhonung',
            priceCents: 200_00,
        });

        await packageService.updatePackagePrice(pack, 200_00);

        const priceHistory = await Price.findAll({
            where: { packageId: pack.id },
        });
        expect(priceHistory.length).toBe(0);
    });

    it('Throws an error when updating price for a non-existent municipality', async () => {
        const pack = await Package.create({
            name: 'Dunderhonung',
            priceCents: 0,
        });

        await expect(
            packageService.updatePackagePrice(pack, 200_00, 'Karachi')
        ).rejects.toThrow();
    });

    it('Falls back to global price if municipality price is not set', async () => {
        const pack = await Package.create({
            name: 'Dunderhonung',
            priceCents: 300_00,
        });

        const response = await packageService.priceFor(pack.name, 'Stockholm');
        expect(response).toBe(300_00);
    });
});
