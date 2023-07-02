import { DataTypes } from 'sequelize';
import sequelize from '../../connection/database.js';

const Item = sequelize.define('Item', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
}, {
  tableName: 'item',
  timestamps: false
});

export default Item
