import {
    type CreationOptional,
    DataTypes,
    type ForeignKey,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { Package } from './package';
import { Municipality } from './municipality';

class PackageMunicipality extends Model<
    InferAttributes<PackageMunicipality>,
    InferCreationAttributes<PackageMunicipality>
> {
    declare id: CreationOptional<number>;
    declare packageId: ForeignKey<Package['id']>;
    declare municipalityId: ForeignKey<Municipality['id']>;

    declare priceCents: number; // current package price for this municipality
}

PackageMunicipality.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        packageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        municipalityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        priceCents: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true,
            },
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: 'package_municipalities',
        indexes: [
            {
                unique: true,
                fields: ['packageId', 'municipalityId'],
            },
        ],
    }
);

export { PackageMunicipality };
