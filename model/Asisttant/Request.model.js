import { DataTypes } from 'sequelize';
import sequelize from '../../connection/database.js';

const ReplacementRequest = sequelize.define('replacement', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time_of_purchase: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tag_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  service_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  frequency_of_rep: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  book_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
},{
  tableName: 'replacement',
  timestamps: false
});

const AdditionalRequest = sequelize.define('add_req', {
add_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time_of_purchase: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title_of_post: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  other_reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'additional_request',
  timestamps: false
});

export { ReplacementRequest, AdditionalRequest };
