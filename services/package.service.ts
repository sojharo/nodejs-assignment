import {Package} from '../models/package';

export default {
	async priceFor(municipality: string) {
    const foundPackage = await Package.findOne({ where: { name: municipality } });

    if (!foundPackage) {
      return null;
    }

		return foundPackage.priceCents;
	},
};
