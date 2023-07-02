import { DataTypes } from 'sequelize';
import sequelize from '../../connection/database.js';

const EvaluateTechnical = sequelize.define('evaluat_technical', {
  evaluat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    technical_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    evaluate_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    evaluation_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },{tableName: 'evaluat_technical',timestamps: false,});

  export default EvaluateTechnical;