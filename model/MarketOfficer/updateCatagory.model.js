import { DataTypes } from 'sequelize';
import sequelize from '../../connection/database.js';

const Category = sequelize.define('Category', {
  cat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  cata_Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'catagory',
  timestamps: false
});

export default Category;
