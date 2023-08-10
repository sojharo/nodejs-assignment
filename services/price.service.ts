import { Package } from '../models/package'
import { Price } from '../models/price'

export default {
  // You may want to use this empty method 🤔
  async getPriceHistory() {},
  async updatePackagePrice(pack: Package, price: number, date: Date = new Date()) {
    const newPriceHistory = await Price.create({ 
      packageId: pack.id, 
      priceCents: price, 
      createdAt: date, 
      updatedAt: date,
    });

    await pack.update({ priceCents: price });

    return newPriceHistory;
  }
}