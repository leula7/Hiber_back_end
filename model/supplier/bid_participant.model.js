import { DataTypes } from "sequelize";
import sequelize from '../../connection/database.js';

    const Bidreg = sequelize.define('bid_participants', {
        bid_participate_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sup_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bid_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tech_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        financial_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        },
        {
            tableName: 'bid_participants',
            timestamps: false,
        }
    );

    
  export default Bidreg;