import { DataTypes } from 'sequelize';
import sequelize from '../../connection/database.js';

const Branch = sequelize.define('branch', {
  Branch_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Branch_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    District_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },{tableName: 'branch',timestamps: false,});

  export default Branch;