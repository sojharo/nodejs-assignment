import { Package } from './package';
import { Price } from './price';
import { Municipality } from './municipality';
import { PackageMunicipality } from './packageMunicipality';

Package.hasMany(Price, {
    sourceKey: 'id',
    foreignKey: 'packageId',
    as: 'prices',
});
Price.belongsTo(Package, {
    foreignKey: 'packageId',
    as: 'package',
});

Municipality.hasMany(Price, {
    sourceKey: 'id',
    foreignKey: 'municipalityId',
    as: 'prices',
});
Price.belongsTo(Municipality, {
    foreignKey: 'municipalityId',
    as: 'municipality',
});

Package.belongsToMany(Municipality, {
    through: PackageMunicipality,
    foreignKey: 'packageId',
    otherKey: 'municipalityId',
    as: 'municipalities',
});

Municipality.belongsToMany(Package, {
    through: PackageMunicipality,
    foreignKey: 'municipalityId',
    otherKey: 'packageId',
    as: 'packages',
});

export { Package, Price, Municipality, PackageMunicipality };
