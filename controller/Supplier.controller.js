import mime from 'mime-types';
import fs from 'fs';
import FinanceDetail from '../model/supplier/financial_detail.model.js';
import TechnicalDocment from '../model/supplier/technical_detail.model.js';
import sequelize from '../connection/database.js';
import Bidreg from '../model/supplier/bid_participant.model.js';
import path from 'path';

  export const TenderNews = async(req,res)=>{

    const tendernews = `SELECT b.bid_title,b.bid_id,b.bid_file FROM bid b WHERE b.bid_done = 0 AND b.publish = 1`;
    try {
        const result= await sequelize.query(tendernews, {
        type: sequelize.QueryTypes.SELECT
      });
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error occurred while fetching proposals"
      });
    }
  }

  export const BidRegister = async(req,res)=>{
    const {sup_id,bid_id} = req.body;
    const bidreg = {
      sup_id,
      bid_id,
      date: new Date(),
    };
console.log(req.body);
    try {
        const newTask = await Bidreg.create(bidreg)
        if(newTask){
          res.json({"message": "Register Success"});
        }
    } catch (error) {
      res.json({
        "error": error.message
      })
    }
  }

  export const Mytenders = async(req,res)=>{
    const sup_id = req.params.sup_id;
    console.log(req.params);
    console.log("Mytenders: ",req.params);
    const mytender = `SELECT bp.bid_participate_id,b.bid_id,b.deadline_date,b.bid_file,b.bid_title FROM bid_participants bp
                      LEFT JOIN bid b on b.bid_id = bp.bid_id WHERE bp.sup_id = :sup_id`;
    try {
     
      const result= await sequelize.query(mytender, {
        replacements: { sup_id: sup_id },
        type: sequelize.QueryTypes.SELECT
      });
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error occurred while fetching proposals"
      });
    }
  }

  export const FinancialForm = async(req,res)=>{
    const bid_id = req.params.bid_id;
    console.log("bid: ",req.params);

    const financialForm = `SELECT bi.*,i.item_name FROM bid_items bi LEFT JOIN item i
                            ON i.item_id = bi.item_id WHERE bid_id = :bid_id`;
    try {
     
      const result= await sequelize.query(financialForm, {
        replacements: { bid_id: bid_id },
        type: sequelize.QueryTypes.SELECT
      });
      console.log(result)
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error occurred while fetching proposals"
      });
    }
  }

  export const MyDocument = async(req,res)=>{
    
    const bid_id = req.params.bid_id;
    console.log("Mytenders: ",req.params);
    const myDocument = `select *from bid where bid_id = :bid_id`;
    try {
     
      const result= await sequelize.query(myDocument, {
        replacements: { bid_id: bid_id },
        type: sequelize.QueryTypes.SELECT
      });
      console.log(result)
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error occurred while fetching proposals"
      });
    }
  }

  export const uploadsTechnical = async (req, res) => {
    try {
      const { bid_participate_id, username } = req.body;
      const file = req.file;
  
      // Check if the file is a PDF
      const fileType = mime.extension(file.mimetype);
      if (fileType !== 'pdf') {
        throw new Error('Only PDF files are allowed.');
      }
  
      const oldname = file.filename;
      const newname = file.originalname;
      const timestamp = Date.now();
      const uniqueFilename = `${newname}_${timestamp}`;
      const userUploadsPath = path.join('./uploads', username);
      const uploadPath = path.join(userUploadsPath, newname);
  
      const techparams = {
        bid_participate_id,
        file_name: uniqueFilename, // Add file_name value
        file_type: fileType, // Add file_type value
        date: new Date(),
      };
  
      try {
        const newFile = await TechnicalDocment.create(techparams);
        if (newFile) {
          // Create the user's uploads folder if it doesn't exist
          if (!fs.existsSync(userUploadsPath)) {
            fs.mkdirSync(userUploadsPath, { recursive: true });
          }
  
          fs.rename(`./uploads/${oldname}`, uploadPath, (err) => {
            if (err) {
              throw err;
            } else {
              res.status(200).json({
                error: '200',
                message: 'upload success',
              });
            }
          });
        }
      } catch (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      res.json({
        error: error.message,
      });
    }
  };
  

  
    // export const SetFinancial = async(req,res)=>{
    //   const {bid_item_id,bid_participate_id,price} = req.body;

    //   const financeParam = {
    //     bid_participate_id,
    //     bid_item_id,
    //     price,
    //     date: new Date(),
    //   };
    
    //   try {
    //       const newTask = await FinanceDetail.create(financeParam)
    //       if(newTask){
    //         res.json({"message": "financial post success"});
    //       }
    //   } catch (error) {
    //     res.json({
    //       "error": error.message
    //     });
    //   }
    // }
  
  export const SetFinancial = async (req, res) => {
      const financialDetails = req.body; // Expecting an array of financial details
      console.log("Financial: ",req.body);
      try {
        const tasks = await Promise.all(
          financialDetails.map(async (detail) => {
            const { bid_item_id, bid_participate_id, price } = detail;
            const financeParam = {
              bid_participate_id,
              bid_item_id,
              price,
              date: new Date(),
            };
            return await FinanceDetail.create(financeParam);
          })
        );
    
        res.json({ message: "Financial posts success", tasks });
      } catch (error) {
        res.json({ error: error.message });
      }
    };
    