import {type Request, type Response} from 'express';
import {Package} from '../models/package';
import {Price} from '../models/price';

export default {
	async getAll(_: Request, response: Response) {
		const packages = await Package.findAll({
			include: [
				{model: Price, as: 'prices'},
			],
		});

		response.send({packages});
	},
};
