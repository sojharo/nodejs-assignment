import { Package } from '../models/package';
import { Municipality } from '../models/municipality';
import { PackageMunicipality } from '../models/packageMunicipality';
import { Price } from '../models/price';

export const seedDb = async () => {
    await Price.destroy({ truncate: true });
    await PackageMunicipality.destroy({ truncate: true });
    await Municipality.destroy({ truncate: true });
    await Package.destroy({ truncate: true });

    await Package.bulkCreate(
        [
            { name: 'basic', priceCents: 20_000 },
            { name: 'plus', priceCents: 59_900 },
            { name: 'premium', priceCents: 111_100 },
        ],
        { validate: true }
    );

    const basic = (await Package.findOne({
        where: { name: 'basic' },
    })) as Package;
    const plus = (await Package.findOne({
        where: { name: 'plus' },
    })) as Package;
    const premium = (await Package.findOne({
        where: { name: 'premium' },
    })) as Package;

    await Price.bulkCreate(
        [
            { priceCents: 5000, packageId: basic.id },
            { priceCents: 10_000, packageId: basic.id },
        ],
        { validate: true }
    );

    await Price.bulkCreate(
        [
            { priceCents: 19_990, packageId: plus.id },
            { priceCents: 29_900, packageId: plus.id },
            { priceCents: 39_900, packageId: plus.id },
        ],
        { validate: true }
    );

    await Price.bulkCreate(
        [
            { priceCents: 55_000, packageId: premium.id },
            { priceCents: 66_600, packageId: premium.id },
            { priceCents: 77_700, packageId: premium.id },
            { priceCents: 88_800, packageId: premium.id },
        ],
        { validate: true }
    );

    const [stockholm, gothenburg, malmo] = await Municipality.bulkCreate(
        [{ name: 'Stockholm' }, { name: 'Gothenburg' }, { name: 'Malmö' }],
        { validate: true, returning: true }
    );

    await PackageMunicipality.bulkCreate(
        [
            {
                packageId: basic.id,
                municipalityId: stockholm.id,
                priceCents: 18_000,
            },
            {
                packageId: basic.id,
                municipalityId: gothenburg.id,
                priceCents: 19_000,
            },

            {
                packageId: plus.id,
                municipalityId: stockholm.id,
                priceCents: 57_000,
            },
            {
                packageId: plus.id,
                municipalityId: malmo.id,
                priceCents: 55_500,
            },

            {
                packageId: premium.id,
                municipalityId: stockholm.id,
                priceCents: 110_000,
            },
            {
                packageId: premium.id,
                municipalityId: gothenburg.id,
                priceCents: 108_000,
            },
            {
                packageId: premium.id,
                municipalityId: malmo.id,
                priceCents: 109_000,
            },
        ],
        { validate: true }
    );

    await Price.bulkCreate(
        [
            {
                priceCents: 18_000,
                packageId: basic.id,
                municipalityId: stockholm.id,
            },
            {
                priceCents: 19_000,
                packageId: basic.id,
                municipalityId: gothenburg.id,
            },

            {
                priceCents: 57_000,
                packageId: plus.id,
                municipalityId: stockholm.id,
            },
            {
                priceCents: 55_500,
                packageId: plus.id,
                municipalityId: malmo.id,
            },

            {
                priceCents: 110_000,
                packageId: premium.id,
                municipalityId: stockholm.id,
            },
            {
                priceCents: 108_000,
                packageId: premium.id,
                municipalityId: gothenburg.id,
            },
            {
                priceCents: 109_000,
                packageId: premium.id,
                municipalityId: malmo.id,
            },
        ],
        { validate: true }
    );
};
