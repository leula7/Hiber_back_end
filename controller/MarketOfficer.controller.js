import { Sequelize } from 'sequelize';
import sequelize from '../connection/database.js';
import Item from '../model/MarketOfficer/SetItem.model.js';
import Category from '../model/MarketOfficer/updateCatagory.model.js';
import GenBid from '../model/MarketOfficer/GenerateBid.model.js';
import fs from 'fs';
import EvaluateTechnical from '../model/MarketOfficer/evaluate_technical.model.js';
import nodemailer from 'nodemailer'
import cron from 'node-cron';
import { Op } from 'sequelize';
import FilterNeeds from '../model/MarketOfficer/filterdata.model.js';
import { validationResult } from 'express-validator';

  export const MyTasks = async (req, res) => {
    const emp_id = req.params.emp_id;

      if (!emp_id) {
        return res.json({
          user: {},
          error: '400',
          message: 'Invalide User',
        });
      }

    const tasks = `SELECT * FROM task t
                    left join catagory c on c.cat_id = t.cat_id
                    WHERE emp_id = :emp_id and status = 0`;

    try {
      const result = await sequelize.query(tasks, {
        replacements: { emp_id: emp_id },
        type: sequelize.QueryTypes.SELECT,
      });
      console.log(result);
      res.json({ result });
    } catch (error) {
      res.json({ message: error.message });
    }
  };

  export const singleTask = async (req, res) => {
    const task_id = req.params.task_id;
    const tasks = `CALL single_task(:task_id)`;
    if (!task_id) {
      return res.json({
        user: {},
        error: '400',
        message: 'Task Not Found',
      });
    }
                  
    try {
      const result = await sequelize.query(tasks, {
        replacements: { task_id: task_id},
        type: sequelize.QueryTypes.PROCEDURE,
      });

      res.json({ result });
    } catch (error) {
      res.json({ message: error.message });
    }
  };

  export const taskDetail = async (req,res)=>{
    const cat_id = req.params.cat_id;
    console.log("Jase: ",req.body)
    const tasks = `SELECT t.prop_id, t.cat_id, i.item_name, i.item_id, SUM(ar.quantity) as quantity
    FROM task t
    LEFT JOIN proposal p ON p.prop_id = t.prop_id
    LEFT JOIN filter_needs fn ON YEAR(fn.Date) = YEAR(p.date)
    LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
    LEFT JOIN additional_request ar ON ar.add_id = ra.req_id
    LEFT JOIN item i ON i.item_id = ar.item_id
    LEFT JOIN catagory c ON c.cat_id = i.cat_id
    WHERE t.prop_id IS NOT NULL AND c.cat_id = :cat_id AND t.prop_id IS NOT NULL
    GROUP BY t.prop_id, t.cat_id, i.item_name, i.item_id
    
    UNION ALL
    
    SELECT t.prop_id, t.cat_id, i.item_name, i.item_id, SUM(rp.quantity) as quantity
    FROM task t
    LEFT JOIN proposal p ON p.prop_id = t.prop_id
    LEFT JOIN filter_needs fn ON YEAR(fn.Date) = YEAR(p.date)
    LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
    LEFT JOIN replacement rp ON rp.rep_id = ra.req_id
    LEFT JOIN item i ON i.item_id = rp.item_id
    LEFT JOIN catagory c ON c.cat_id = i.cat_id
    WHERE t.prop_id IS NOT NULL AND c.cat_id = :cat_id AND t.prop_id IS NOT NULL
    GROUP BY t.prop_id, t.cat_id, i.item_name, i.item_id`;
                  
    try {
      const result = await sequelize.query(tasks, {
        replacements: { cat_id: cat_id},
        type: sequelize.QueryTypes.SELECT,
      });
      res.status(200).json({ result });
    } catch (error) {
      res.json({ message: error.message });
    }
  }

  export const doneTasks = async (req, res) => {
    const user_id = req.body.user_id;
    
    const tasks = `select * from task where status = 1 and emp_id = ${user_id}`;
  
    try {
      const result =await sequelize.query(tasks, {
        type: Sequelize.QueryTypes.SELECT,
      });
  
      res.json(result);
    } catch (error) {
      res.json({ message: error.message });
    }
  };

  export const generatedocument = async(req,res)=>{
  const getDocument = `
    SELECT a.add_id as request_id, b.branch_name, b.branch_id, fn.filter_req_app,
      a.user_id, i.item_name, i.item_id, i.price, a.quantity, 'Additional' AS purpose,
      a.time_of_purchase, ra.req_app_id, ra.user_id, ra.req_status
    FROM filter_needs fn
    LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
    LEFT JOIN additional_request a ON ra.req_id = a.add_id
    LEFT JOIN item i ON a.item_id = i.item_id
    LEFT JOIN user us ON a.user_id = us.user_id
    LEFT JOIN branch b ON us.branch_id = b.branch_id
    WHERE ra.req_app_id IS NOT NULL
    UNION ALL
    SELECT r.rep_id as request_id, b.branch_name, b.branch_id, fn.filter_req_app,
      r.user_id, i.item_name, i.item_id, i.price, r.quantity, 'Replacement' AS purpose,
      r.time_of_purchase, ra.req_app_id, ra.user_id, ra.req_status
    FROM filter_needs fn
    LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
    LEFT JOIN replacement r ON ra.req_id = r.rep_id
    LEFT JOIN item i ON r.item_id = i.item_id
    LEFT JOIN user us ON r.user_id = us.user_id
    LEFT JOIN branch b ON us.branch_id = b.branch_id
    WHERE ra.req_app_id IS NOT NULL;`;

      try {
        const result = await sequelize.query(getDocument, {
          type: sequelize.QueryTypes.SELECT,
        });

        res.json({ result });
      } catch (error) {
        res.json({ message: error.message });
      }

  };

  // export const technical_documnets = async(req,res)=>{
  //   const { supplier_id, position } = req.query;

  //   let filesQuery = "SELECT * FROM files";
  //   const filesParams = [];
    
  //   if (position === "supplier") {
  //     filesQuery = "SELECT * FROM files WHERE supplier_id = ?";
  //     filesParams.push(supplier_id);
  //   }
    
  //   try {
  //     const response = await sequelize.query(filesQuery, {
  //       type: sequelize.QueryTypes.SELECT,
  //       replacements: filesParams,
  //     });
    
  //     res.json({ response });
  //   } catch (error) {
  //     res.json({ message: error.message });
  //   }
    
  // };

  export const setprice = async (req, res) => {
    try {
      const { item_id, price } = req.body;
  
      const [updatedRows] = await Item.update(
        { price: price },
        { where: { item_id: item_id } }
      );
  
      if (updatedRows > 0) {
        res.status(200).json({
            error: "200",
           message: "Price Updated", row: updatedRows });
      } else {
        res.json({
            error: "400",
           message: "Item not found" });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "200", message: error.message });
    }
  };
  
  export const updateCatagory = async(req,res)=>{
    try {
      const { cat_id, cata_Name } = req.params;
  
      const result = await Category.update(
        { cata_Name },
        { where: { cat_id } }
      );
  
      if (result[0] > 0) {
        res.status(200).json({ message: 'Category Updated' });
      } else {
        res.json({ message: 'No rows updated' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: '400', message: error.message });
    }
  };

  export const updateItem = async(req,res)=>{
      try {
        const { item_id, item_name } = req.params;
        const result = await Item.update(
          { item_name: item_name },
          { where: { item_id: item_id } }
        );
        if (result[0] > 0) {
          res.json({ message: 'Item Updated' });
        } else {
          res.json({ message: 'Item not found' });
        }
      } catch (error) {
        console.log(error);
        res.json({ error: '400', message: error.message });
      }
  };

  export const techDoc = async(req,res)=>{
    const {supplier_id,position} = req.query;

      let filesQuery = "SELECT * FROM files WHERE supplier_id = ?";
      if (position === "supplier") {
        filesQuery = "SELECT * FROM files WHERE supplier_id = ?";
      } else {
        filesQuery = "SELECT * FROM files";
      }

      const response = await sequelize.query(filesQuery, {
        replacements: [supplier_id],
        type: sequelize.QueryTypes.SELECT
      });

      res.json({
        response
      });
};

  export const quarterPrice = async(req,res)=>{
      const quarterPrice =  `  SELECT i.cat_id, c.cata_Name, r.time_of_purchase AS quarter, i.cat_id AS item_cat_id,
                              fn.filter_req_app,ra.req_app_id,ra.req_status,r.rep_id,ra.req_id,i.item_id,i.price
                              FROM filter_needs fn 
                              LEFT JOIN request_approve ra on fn.filter_req_app = ra.req_app_id
                              LEFT JOIN replacement r on ra.req_id = r.rep_id
                              LEFT JOIN item i on r.item_id = i.item_id
                              LEFT JOIN catagory c on c.cat_id = i.cat_id
                              
                              UNION ALL
                              
                              SELECT i.cat_id, c.cata_Name, a.time_of_purchase AS quarter, i.cat_id AS item_cat_id,
                              fn.filter_req_app,ra.req_app_id,ra.req_status,a.add_id,ra.req_id,i.item_id,i.price
                              FROM filter_needs fn 
                              LEFT JOIN request_approve ra on fn.filter_req_app = ra.req_app_id
                              LEFT JOIN additional_request a on ra.req_id = a.add_id
                              LEFT JOIN item i on a.item_id = i.item_id
                              LEFT JOIN catagory c on c.cat_id = i.cat_id`;
      try {
          const result = await sequelize.query(quarterPrice, {
          type: sequelize.QueryTypes.SELECT
        });
        res.json({ result });
      } catch (error) {
        res.json({ message: error.message });
      }
  }

  export const filterdata = async (req, res) => {
   // const filter = req.body; // Change 'filters' to 'filter'
    const {user_id,filter_req_app } = req.body;
    const filter = {
      user_id,
      filter_req_app,
      Date: new Date(),
    };
  
    try {
        const filters = await FilterNeeds.create(filter)
        if(filters){
          res.json({"message": "Filter Success"});
        }
    } catch (error) {
      res.json({
        "error": error.message
      })
    }
  };
  
  export const filtered_data= async (req, res) => {
        const { cat_id } = req.params;
        let getFilteredData = `SELECT a.add_id as request_id, b.branch_name, b.branch_id,
            a.user_id, i.item_name, i.item_id, i.price, a.quantity, 'Additional' 
            as purpose, a.time_of_purchase, ra.req_app_id, ra.user_id, ra.req_status FROM filter_needs fn
            LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
            LEFT JOIN additional_request a ON a.add_id = ra.req_id 
            JOIN item i ON a.item_id = i.item_id 
            JOIN user us ON a.user_id = us.user_id 
            JOIN branch b ON us.branch_id = b.branch_id WHERE i.cat_id = ?
            UNION 
            SELECT r.rep_id as request_id, b.branch_name, b.branch_id,
            r.user_id, i.item_name, i.item_id, i.price, r.quantity, 
            'Replacement' as purpose, r.time_of_purchase, ra.req_app_id, 
            ra.user_id, ra.req_status FROM filter_needs fn
            LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
            LEFT JOIN replacement r ON r.rep_id = ra.req_id 
            JOIN item i ON r.item_id = i.item_id 
            JOIN user us ON r.user_id = us.user_id
            JOIN branch b ON us.branch_id = b.branch_id WHERE i.cat_id = ? ORDER BY branch_name`;

        try {
          if (cat_id == -1) {
            getFilteredData = `SELECT a.add_id as request_id, b.branch_name, b.branch_id,
                                a.user_id, i.item_name, i.item_id, i.price, a.quantity, 'Additional' 
                                as purpose, a.time_of_purchase, ra.req_app_id, ra.user_id, ra.req_status FROM filter_needs fn
                                LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
                                LEFT JOIN additional_request a ON a.add_id = ra.req_id 
                                JOIN item i ON a.item_id = i.item_id 
                                JOIN user us ON a.user_id = us.user_id 
                                JOIN branch b ON us.branch_id = b.branch_id
                                UNION 
                                SELECT r.rep_id as request_id, b.branch_name, b.branch_id,
                                r.user_id, i.item_name, i.item_id, i.price, r.quantity, 
                                'Replacement' as purpose, r.time_of_purchase, ra.req_app_id, 
                                ra.user_id, ra.req_status FROM filter_needs fn
                                LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
                                LEFT JOIN replacement r ON r.rep_id = ra.req_id 
                                JOIN item i ON r.item_id = i.item_id 
                                JOIN user us ON r.user_id = us.user_id
                                JOIN branch b ON us.branch_id = b.branch_id ORDER BY branch_name`;
          }
          
          const result = await sequelize.query(getFilteredData, {
            replacements: [cat_id, cat_id],
            type: QueryTypes.SELECT,
          });
          
          res.status(200).json({ result });
        } catch (error) {
          res.json({ message: error.message });
        }
    };

  export const filter_documnet = async (req, res) => {
    const getDocumnet = `
      SELECT a.add_id AS request_id, b.branch_name, b.branch_id,
        a.user_id, i.item_name, i.item_id, i.price, a.quantity, 'Additional' AS purpose, a.time_of_purchase, ra.req_app_id, ra.user_id, ra.req_status
      FROM request_approve ra
      LEFT JOIN additional_request a ON a.add_id = ra.req_id 
      JOIN item i ON a.item_id = i.item_id 
      JOIN user us ON a.user_id = us.user_id 
      JOIN branch b ON us.branch_id = b.branch_id 
      WHERE ra.req_status = 'Approve'
      AND NOT EXISTS (
        SELECT 1
        FROM filter_needs fn
        WHERE fn.filter_req_app = ra.req_app_id
      )
      UNION 
      SELECT r.rep_id AS request_id, b.branch_name, b.branch_id,
        r.user_id, i.item_name, i.item_id, i.price, r.quantity, 'Replacement' AS purpose, r.time_of_purchase, ra.req_app_id, ra.user_id, ra.req_status
      FROM request_approve ra
      LEFT JOIN replacement r ON r.rep_id = ra.req_id 
      JOIN item i ON r.item_id = i.item_id 
      JOIN user us ON r.user_id = us.user_id
      JOIN branch b ON us.branch_id = b.branch_id 
      WHERE ra.req_status = 'Approve'
      AND NOT EXISTS (
        SELECT 1
        FROM filter_needs fn
        WHERE fn.filter_req_app = ra.req_app_id
      )
      ORDER BY branch_id`;
  
    try {
      const result = await sequelize.query(getDocumnet, {
        type: Sequelize.QueryTypes.SELECT,
      });
  
      res.json({ result });
    } catch (error) {
      res.json({ message: error.message });
    }
  };

  export const generateProposal = async (req, res) => {
    const user_id = req.body.user_id;
    const prop_title = "proposal for "+new Date().getFullYear();
    console.log(user_id)
    const propos = `INSERT INTO proposal (user_id,title, total_price)
                SELECT :user_id, :prop_title, SUM(subquery.total_price) AS total_price
                FROM (
                  SELECT fn.Date, SUM(ar.quantity * i.price) AS total_price
                  FROM filter_needs fn
                  LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
                  LEFT JOIN additional_request ar ON ar.add_id = ra.req_id
                  LEFT JOIN item i ON i.item_id = ar.item_id
                  WHERE YEAR(fn.Date) = YEAR(CURDATE())
                  GROUP BY fn.Date

                  UNION ALL

                  SELECT fn.Date, SUM(rp.quantity * i.price) AS total_price
                  FROM filter_needs fn
                  LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
                  LEFT JOIN replacement rp ON rp.rep_id = ra.req_id
                  LEFT JOIN item i ON i.item_id = rp.item_id
                  WHERE YEAR(fn.Date) = YEAR(CURDATE())
                  GROUP BY fn.Date
                ) AS subquery;`;
    try {
      await sequelize.query(propos, {
        type: Sequelize.QueryTypes.INSERT,
        replacements: { user_id, prop_title },
      });
  
      res.json({ message: 'Insertion successful' });
    } catch (error) {
      res.json({ message: error.message });
    }
  };

  export const getProposal = async (req, res) => {
    const propsal = `select * from proposal`;
  console.log("metekeal")
    try {
      const result =await sequelize.query(propsal, {
        type: Sequelize.QueryTypes.SELECT,
      });
  
      res.json(result);
    } catch (error) {
      res.json({ message: error.message });
    }
  };

  export const ApprovedProposals = async(req,res)=>{

    const approvedproposal = `select * from proposal where status = 1`;
  
    try {
      const result =await sequelize.query(approvedproposal, {
        type: Sequelize.QueryTypes.SELECT,
      });
  
      res.json(result);
    } catch (error) {
      res.json({ message: error.message });
    }
  }

  export const BidInitialize = async (req, res) => {
    const { prop_id, user_id, cat_id} = req.body;
    console.log(req.body);
    const bidparams = {
      user_id,
      prop_id,
      cat_id,
      date: new Date(),
    };

    try {
      const newTask = await GenBid.create(bidparams);
      if (newTask) {
        res.status(200).json({ message: "Bid Initialized" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const GetBid = async(req,res)=>{
    const user_id = req.params.user_id;
    const approvedproposal = `select * from bid where user_id = :user_id`;
  
    try {
      const result =await sequelize.query(approvedproposal, {
        replacements: {user_id: user_id},
        type: Sequelize.QueryTypes.SELECT,
      });
      console.log(result)
      res.json(result);
    } catch (error) {
      res.json({ message: error.message });
    }
  }
  
  export const uploadBidDocument = async (req, res) => {

    if(req.file == null || req.body == null){
      return
    }

    const bid_id = req.body.bid_id;
    const oldname = req.file?.filename;
    const newname = req.file?.originalname;
    const timestamp = Date.now();

    const uniqueFilename = `${newname}_${timestamp}`;
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const uploadPath = `./uploads/bids/${month}-${year}/${newname}`;
    const uploadFolder = `./uploads/bids/${month}-${year}`;
  
    try {
      const result = await GenBid.update(
        { bid_file: uniqueFilename },
        { where: { bid_id } }
      );
  
      if (result[0] > 0) {
        if (!fs.existsSync(uploadFolder)) {
          fs.mkdirSync(uploadFolder);
        }
  
        await fs.promises.rename(`./uploads/${oldname}`, uploadPath);
        res.status(200).json({ message: "Bid Upload Success" });
      } else {
        res.status(500).json({ error: "No rows updated" });
      }
    } catch (error) {
      console.error("Error while uploading the document:", error);
      res.status(500).json({ error: "Error while uploading the document", details: error.message });
    }
  };
  
  export const updateBid = async (req, res) => {
    try {
  
            const {
              bid_id,
              bid_price,
              tender_type,
              bid_title,
              bid_done,
              deadline_date,
              financial_open_date,
              publish,
              tech_visibility,
              financial_visibility,
            } = req.body;
  
      const result = await GenBid.update(
        {
          bid_price,
          tender_type,
          deadline_date,
          financial_open_date,
          publish,
          bid_title,
          tech_visibility,
          financial_visibility,
          bid_done,
        },
        { where: { bid_id } }
      );
  
      if (result[0] > 0) {
        if (financial_open_date != null) {
          SedEmailForTechPass(bid_id,financial_open_date);
        }
        res.status(200).json({status: '200', message: 'Bid Updated' });
      } else {
        res.json({status: '400', message: 'Nothing Change' });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: '400', message: error.message });
    }
  };
  
  export const GetParticipants = async(req,res)=>{
    const bid_id = req.params.bid_id;
    const participants = `SELECT bp.bid_participate_id,s.First_Name,s.Last_Name,td.file_name,
                          s.username,td.technical_id FROM bid_participants bp
                          LEFT JOIN technical_doc td on td.bid_participate_id = bp.bid_participate_id
                          LEFT JOIN supplier s on s.supplier_id = bp.sup_id
                          where bid_id = :bid_id`;
    try {
     
      const result= await sequelize.query(participants,{
        replacements: { bid_id: bid_id },
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

  export const technicalDetail = async(req,res)=>{
    const {bid_id,sup_id} = req.params;
    const participants = `SELECT td.technical_id,bp.bid_participate_id,s.First_Name,s.Last_Name,td.file_name,
                          s.username,td.technical_id FROM bid_participants bp
                          LEFT JOIN technical_doc td on td.bid_participate_id = bp.bid_participate_id
                          LEFT JOIN supplier s on s.supplier_id = bp.sup_id
                          where bid_id = :bid_id and s.supplier_id = :sup_id`;
    try {
     
      const result= await sequelize.query(participants,{
        replacements: { bid_id: bid_id,sup_id: sup_id},
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

  export const EvaluateTechnicalDocument = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Handle validation errors
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { user_id, technical_id, evaluate_value } = req.body;
  
      const response = await EvaluateTechnical.create({
        user_id: user_id,
        technical_id: technical_id,
        evaluate_value: evaluate_value,
      });
  
      if (response) {
        res.json({ message: "Evaluation Success" });
      } else {
        res.json({ message: "Evaluation Error" });
      }
    } catch (error) {
      console.log(error);
      res.json({
        error: "200",
        message: error.message,
      });
    }
  };
  

  //SEND EMAIL FOR TECHNICAL PASS SUPPLIER
  export const SedEmailForTechPass = async(bid_id,financial_open_date)=>{
    const getPassedEmails = `SELECT email,et.evaluate_value FROM bid_participants bp
                            LEFT JOIN technical_doc td on bp.bid_participate_id = td.bid_participate_id
                            LEFT JOIN evaluat_technical et on et.technical_id = td.technical_id
                            LEFT JOIN supplier s on s.supplier_id = bp.sup_id 
                            WHERE bid_id = :bid_id`;
    const passedTechnical = [];
    const FailTechnical = [];
    const MissedTechnical = [];
    
    try {
      const response = await sequelize.query(getPassedEmails, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {bid_id: bid_id}
      });
    
      response.map(technical => {
        const emailObject = {
          email: technical.email,
          evaluateValue: technical.evaluate_value
        };
    
        if (technical.evaluate_value >= 70) {
          passedTechnical.push(emailObject);
        } else if (technical.evaluate_value < 70 && technical.evaluate_value != null) {
          FailTechnical.push(emailObject);
        } else {
          MissedTechnical.push(emailObject);
        }
      });

      passedTechnical.map(pass=>{
        const recipient = pass.email;
        const evaluateValue = pass.evaluateValue;
        const subject = 'Congratulations! Technical Evaluation Passed';
        const message = `Your technical evaluation (score: ${evaluateValue}) passed.\n
                          Financial Will be Open on Date: ${financial_open_date}`;
            sendEmail(recipient, subject, message);
      });

      FailTechnical.map(fail=>{
            const recipient = fail.email;
            const evaluateValue = fail.evaluateValue;
            const subject = 'Technical Evaluation Failed';
            const message = `Unfortunately, your technical evaluation (score: ${evaluateValue}) did not meet the required threshold.`;
            sendEmail(recipient, subject, message);
      });

      MissedTechnical.map(miss=>{
          const recipient = miss.email;
          const subject = 'Missed Technical Evaluation';
          const message = `You missed the technical evaluation. Please make sure to submit your evaluation in future opportunities.`;
          sendEmail(recipient, subject, message);
      });

    } catch (error) {
      console.log(error);
    } 
  }

  //SEND EMAIL FOR fINANCIAL WINNER SUPPLIER
  export const SedEmailForFinancialWinner = async()=>{
    const getPassedEmails = `SELECT w.win_id,s.email, s.First_Name,s.Last_Name,bi.item_id,fd.bid_participate_id,i.item_name,fd.price FROM winner w
                                  LEFT JOIN financial_detail fd ON w.finance_detail = fd.finance_id
                                  LEFT JOIN bid_participants bp ON bp.bid_participate_id = fd.bid_participate_id
                                  LEFT JOIN bid_items bi ON bi.bid_item_id = fd.bid_item_id
                                  LEFT JOIN item i ON i.item_id = bi.item_id
                                  LEFT JOIN supplier s ON s.supplier_id = bp.sup_id`;
    const Winner = [];
    
    try {
      const financial = await sequelize.query(getPassedEmails);
    
      financial[0].map(fincance => {
        const emailObject = {
          email: fincance.email,
          item: fincance.item_name
        };
        Winner.push(emailObject);
      });

      Winner.map(win=>{
        const recipient = win.email;
        const items = win.item;
        const subject = 'Congratulations! You have Won The finanancial';
        const message = `Your winning Itmes are ${items}`;
              sendEmail(recipient, subject, message);
      });

    } catch (error) {
      console.log(error);
    } 
  }

  export const getWinners = async(req,res)=>{
    const bid_id = req.params.bid_id;
    console.log("Winner: :",bid_id);
    const winners =  `SELECT w.win_id, s.First_Name,s.Last_Name,bi.item_id,fd.bid_participate_id,i.item_name,fd.price FROM winner w
                      LEFT JOIN financial_detail fd ON w.finance_detail = fd.finance_id
                      LEFT JOIN bid_participants bp ON bp.bid_participate_id = fd.bid_participate_id
                      LEFT JOIN bid_items bi ON bi.bid_item_id = fd.bid_item_id
                      LEFT JOIN item i ON i.item_id = bi.item_id
                      LEFT JOIN supplier s ON s.supplier_id = bp.sup_id
                      WHERE bi.bid_id = :bid_id`;
      try {
            const result = await sequelize.query(winners, 
            { 
              replacements: {bid_id: bid_id},
              type: sequelize.QueryTypes.SELECT });
            res.json(result)
      } catch (error) {
        res.json(error);
      }
  }

  export const ItemDetail = async(req,res)=>{
    const {item_id,bid_id} = req.params;
    console.log("reeuwst : ",req.params)
    const winners =  `SELECT s.First_Name, s.Last_Name, bi.item_id, fd.bid_participate_id, i.item_name, fd.price
    FROM financial_detail fd
    LEFT JOIN bid_items bi ON bi.bid_item_id = fd.bid_item_id
    LEFT JOIN item i ON i.item_id = bi.item_id
    LEFT JOIN bid_participants bp ON bp.bid_id = bi.bid_id
    LEFT JOIN supplier s ON s.supplier_id = bp.sup_id
    WHERE bi.item_id = :item_id AND bp.bid_id = :bid_id
    GROUP BY fd.bid_participate_id`
      try {
            const result = await sequelize.query(winners, 
            { 
              replacements: {item_id: item_id,bid_id: bid_id},
              type: sequelize.QueryTypes.SELECT
             });
            res.json(result)
      } catch (error) {
        res.json(error);
      }
  }

  export const getPublished = async(req,res)=>{
   const user_id = req.params.user_id
    const publish =  `select * from bid where publish = 1 and user_id = :user_id`
      try {
            const result = await sequelize.query(publish, 
            { replacements: {user_id: user_id},
              type: sequelize.QueryTypes.SELECT });
            res.json(result)
      } catch (error) {
        res.json(error);
      }
  }

  export const ongoingDetail = async(req,res)=>{
    const bid_id = req.params.bid_id
    console.log("metekal; ",bid_id)
     const ongoinddetail =  `select tech_visibility,financial_visiblity from bid where publish = 1 and bid_id = :bid_id`
       try {
             const result = await sequelize.query(ongoinddetail, 
             { replacements: {bid_id: bid_id},
               type: sequelize.QueryTypes.SELECT });
              console.log(result);
             res.json(result)
       } catch (error) {
         res.json(error);
       }
   }
    
  export const setWinner = async()=>{
    const winners =  `INSERT INTO winner (finance_detail)
                    SELECT fd.finance_id
                    FROM financial_detail fd
                    LEFT JOIN bid_items bi ON bi.bid_item_id = fd.bid_item_id 
                    WHERE fd.price = (SELECT MIN(price) FROM financial_detail WHERE bid_item_id = fd.bid_item_id)`;
      try {
            const result = await sequelize.query(winners, 
            { type: sequelize.QueryTypes.INSERT });
      } catch (error) {
        console.log("Error Occure")
      }
  }

  const visibility = async () => {
    try {
      const currentDate = new Date();
      // Update the tech_visibility column where dead_line_date is equal to the current date
      const result = await GenBid.update(
        { tech_visibility: 1 },
        {
          where: sequelize.where(sequelize.col('deadline_date'), { [Op.lte]: currentDate }),
          logging: false
        }
      );

      const finance = await GenBid.update(
        { financial_visiblity: 1 },
        {
          where: sequelize.where(sequelize.col('financial_open_date'), { [Op.lte]: currentDate }),
          logging: false 
        }
      );
  
      if (finance[0] > 0) {
        console.log("Financila: :,",finance[0])
        setWinner();
        SedEmailForFinancialWinner();
        console.log('Financial visibility updated successfully.');
      }

      if (result[0] > 0) {
        console.log('Tech visibility updated successfully.');
      }
    } catch (error) {
      console.error('Error updating tech visibility:', error);
    }
  };

  const sendEmail = async(to,subject,text)=>{

    const tranporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user: "leulkahssaye1000@gmail.com",
        pass: "csujqjgvhpcwkvnm"
      }
    });

    const mailOptions = {
      from: "leulkahssaye1000@gmail.com",
      to: to,
      subject: subject,
      text: text
    };

    tranporter.sendMail(mailOptions,(error,info)=>{
        if(error){
          console.log(error);
        }else{
          console.log('Email Sent: '+info.response);
        }
    });
  }

  cron.schedule('*/5 * * * * *', visibility);