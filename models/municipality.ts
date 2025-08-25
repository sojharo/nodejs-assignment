import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
    type NonAttribute,
    type Association,
} from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { Price } from './price';
import { Package } from './package';

class Municipality extends Model<
    InferAttributes<Municipality>,
    InferCreationAttributes<Municipality>
> {
    declare static associations: {
        prices: Association<Municipality, Price>;
        packages: Association<Municipality, Package>;
    };

    declare id: CreationOptional<number>;
    declare name: string;

    declare prices?: NonAttribute<Price[]>;
    declare packages?: NonAttribute<Package[]>;
}

Municipality.init(
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
    },
    {
        sequelize: sequelizeConnection,
        tableName: 'municipalities',
    }
);

export { Municipality };
