import { sequelizeConnection } from '../../db/config';
import { Municipality } from '../../models';
import { Package } from '../../models/package';
import PackageService from '../../services/package.service';
import PriceService from '../../services/price.service';

describe('PriceService', () => {
    // Set the db object to a variable which can be accessed throughout the whole test file
    const db = sequelizeConnection;

    // Before any tests run, clear the DB and run migrations with Sequelize sync()
    beforeEach(async () => {
        await db.sync({ force: true });
    });

    afterAll(async () => {
        await db.close();
    });

    it('Returns the pricing history for the provided year and package', async () => {
        const basic = await Package.create({
            name: 'basic',
            priceCents: 20_00,
        });

        const gothenburg = await Municipality.create({ name: 'Göteborg' });
        const stockholm = await Municipality.create({ name: 'Stockholm' });

        const date = new Date();

        // These should NOT be included
        date.setFullYear(2019);
        await PackageService.updatePackagePrice(
            basic,
            25_00,
            gothenburg.name,
            date
        );
        await PackageService.updatePackagePrice(
            basic,
            35_00,
            stockholm.name,
            date
        );

        // These should be included
        date.setFullYear(2020);
        await PackageService.updatePackagePrice(
            basic,
            30_00,
            gothenburg.name,
            date
        );
        await PackageService.updatePackagePrice(
            basic,
            40_00,
            stockholm.name,
            date
        );
        await PackageService.updatePackagePrice(
            basic,
            100_00,
            stockholm.name,
            date
        );

        const history = await PriceService.getPriceHistory('basic', 2020);

        expect(history).toEqual({
            Göteborg: [30_00],
            Stockholm: [40_00, 100_00],
        });
    });

    it('Supports filtering on municipality', async () => {
        const basic = await Package.create({
            name: 'basic',
            priceCents: 20_00,
        });

        const gothenburg = await Municipality.create({ name: 'Göteborg' });
        const stockholm = await Municipality.create({ name: 'Stockholm' });

        const date = new Date();

        date.setFullYear(2020);
        await PackageService.updatePackagePrice(
            basic,
            20_00,
            gothenburg.name,
            date
        );
        await PackageService.updatePackagePrice(
            basic,
            30_00,
            stockholm.name,
            date
        );
        await PackageService.updatePackagePrice(
            basic,
            100_00,
            stockholm.name,
            date
        );

        const history = await PriceService.getPriceHistory(
            'basic',
            2020,
            'Stockholm'
        );

        expect(history).toEqual({
            Stockholm: [30_00, 100_00],
        });
    });

    it('Returns empty object if no history exists for given year', async () => {
        const basic = await Package.create({
            name: 'basic',
            priceCents: 20_00,
        });
        const gothenburg = await Municipality.create({ name: 'Göteborg' });

        const date = new Date();
        date.setFullYear(2018);
        await PackageService.updatePackagePrice(
            basic,
            10_00,
            gothenburg.name,
            date
        );

        const history = await PriceService.getPriceHistory('basic', 2020);

        expect(history).toEqual({});
    });

    it('Falls back to global package history if package is not in any municipality', async () => {
        const basic = await Package.create({
            name: 'basic',
            priceCents: 20_00,
        });

        const date = new Date();
        date.setFullYear(2020);
        await PackageService.updatePackagePrice(basic, 50_00, undefined, date);

        const history = await PriceService.getPriceHistory('basic', 2020);

        expect(history).toEqual({
            global: [50_00],
        });
    });
});
