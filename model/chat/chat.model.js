import { DataTypes } from 'sequelize';
import sequelize from '../../connection/database.js';

const Chat = sequelize.define('chat', {
  msg_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sender: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reciever: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  }
},
{
    tableName: 'message',
    timestamps: false, // Specify the custom table name here
});

export default Chat;