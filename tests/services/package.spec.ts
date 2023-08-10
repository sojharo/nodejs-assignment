import {sequelizeConnection} from '../../db/config';
import {Package} from '../../models/package';
import PackageService from '../../services/package.service';

describe('PackageService', () => {
	// Set the db object to a variable which can be accessed throughout the whole test file
	const db = sequelizeConnection;
	const packageService = PackageService;

	// Before any tests run, clear the DB and run migrations with Sequelize sync()
	beforeAll(async () => {
		await db.sync({force: true});
	});

	afterAll(async () => {
		await db.close();
	});

	it('Supports adding a price for a specific municipality', async () => {
		await Package.create({name: 'Dunderhonung', priceCents: 200_00});

		const response = await packageService.priceFor('Göteborg');

		expect(response).toBe(200_00);
	});
});
