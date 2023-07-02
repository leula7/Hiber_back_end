import { DataTypes } from "sequelize";
import sequelize from '../../connection/database.js';

    const FinanceDetail = sequelize.define('Financial_Detail', {
        finance_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        bid_participate_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bid_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        },
        {
            tableName: 'financial_detail',
            timestamps: false,
        }
    );

  export default FinanceDetail;