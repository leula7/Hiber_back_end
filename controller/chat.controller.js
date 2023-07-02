import Chat from '../model/chat/chat.model.js';
import { Op } from 'sequelize';
import {User} from '../model/Auth/Auth.model.js'
import sequelize from '../connection/database.js';


export const chat = async(req,res)=>{
    const {sender,reciever,message} = req.body;
    const now = new Date();
    const time = now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric',second: 'numeric', hour12: true });
    const chatParams = {
      sender,
      reciever,
      message,
      time,
    };

    try {
        const newChat = await Chat.create(chatParams)
        if(newChat){
          res.json({"message": "Message Sent"});
        }
    } catch (error) {
      console.log("/chat ",error)
      res.json({
        "error": error.message
      })
    }
  }

  export const getcaht = async(req,res)=>{
    const {sender,reciever} = req.params;
      try {
      const result = await Chat.findAll({
        where: {
          [Op.or]: [
            {
              sender: sender,
              reciever: reciever,
            },
            {
              sender: reciever,
              reciever: sender,
            },
          ],
        },
      });
                        
      res.json({ result });
    } catch (error) {
      console.log('/chat', error);
      res.json({
        error: error.message,
      });
    }                  
  }

  export const getlastMessage = async(req,res)=>{
    const {position} = req.params;
    const getUsers = `SELECT u.user_id, u.username,m.time, m.message as "last_massage"
            FROM user u 
            LEFT JOIN message m ON u.user_id = m.sender OR u.user_id = m.reciever 
            WHERE m.msg_id = (
              SELECT MAX(msg_id) 
              FROM message 
              WHERE sender = u.user_id OR reciever = u.user_id
            ) OR m.msg_id IS NULL;`;
      const filesParams = [];
            try {
              filesParams.push(position);
              const result = await sequelize.query(getUsers, {
                type: sequelize.QueryTypes.SELECT,
                replacements: filesParams,
              });
              res.json({ result });
            } catch (error) {
              console.log('/chat', error);
              res.json({ error: error.message });
            }
  }