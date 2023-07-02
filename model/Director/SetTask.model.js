import { DataTypes } from "sequelize";
import sequelize from '../../connection/database.js';

    const SetTask = sequelize.define('Task', {
        task_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dire_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        emp_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        prop_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cat_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        task_desc: {
            type: DataTypes.STRING,
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
            tableName: 'task',
            timestamps: false,
        }
    );

  export default SetTask;