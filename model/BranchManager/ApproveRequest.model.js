import { DataTypes } from "sequelize";
import sequelize from '../../connection/database.js';

    const RequestApprove = sequelize.define('RequestApprove', {
        req_app_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        req_status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        },
        {
            tableName: 'request_approve',
            timestamps: false,
        }
    );

  export default RequestApprove;