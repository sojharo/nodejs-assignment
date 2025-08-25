import {
    type Association,
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
    type NonAttribute,
} from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { Price } from './price';
import { Municipality } from './municipality';

class Package extends Model<
    InferAttributes<Package>,
    InferCreationAttributes<Package>
> {
    declare static associations: {
        prices: Association<Package, Price>;
        municipalities: Association<Package, Municipality>;
    };

    declare id: CreationOptional<number>;
    declare name: string;
    declare priceCents: number; // global current price for package

    declare prices?: NonAttribute<Price[]>;
    // To see in which municipalities we have specific price instead of global package price
    declare municipalities?: NonAttribute<Municipality[]>;
}

Package.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        tableName: 'packages',
    }
);

export { Package };
