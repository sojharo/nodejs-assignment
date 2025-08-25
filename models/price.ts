import {
    type CreationOptional,
    DataTypes,
    type ForeignKey,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { type Package } from './package';

class Price extends Model<
    InferAttributes<Price>,
    InferCreationAttributes<Price>
> {
    declare id: CreationOptional<number>;
    declare priceCents: number;

    declare packageId: ForeignKey<Package['id']>;
    declare municipalityId: CreationOptional<ForeignKey<Package['id']>>;

    declare createdAt: CreationOptional<Date>;
}

Price.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        priceCents: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true,
            },
        },
        packageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        municipalityId: {
            type: DataTypes.INTEGER,
            allowNull: true, // for global package price
        },
        createdAt: DataTypes.DATE,
    },
    {
        sequelize: sequelizeConnection,
        tableName: 'prices',
        updatedAt: false, // immutable log table, no updates
    }
);

export { Price };
