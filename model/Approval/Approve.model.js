import { DataTypes } from "sequelize";
import sequelize from '../../connection/database.js';

    const Proposal = sequelize.define('Proposal', {
        prop_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        checked_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        },
        {
            tableName: 'proposal',
            timestamps: false,
        }
    );

  export default Proposal;