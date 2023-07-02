import { DataTypes } from "sequelize";
import sequelize from '../../connection/database.js';

    const TechnicalDocment = sequelize.define('Technical_Doc', {
        technical_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        bid_participate_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        },
        {
            tableName: 'technical_doc',
            timestamps: false,
        }
    );

    
  export default TechnicalDocment;