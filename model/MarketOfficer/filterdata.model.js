import { DataTypes } from 'sequelize';
import sequelize from '../../connection/database.js';

const FilterNeeds = sequelize.define('filter_needs', {
    filter_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filter_req_app: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.NOW,
    },
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
  
  );

  export default FilterNeeds;