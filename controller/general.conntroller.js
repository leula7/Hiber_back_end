import sequelize from '../connection/database.js';


  export const branch = async(req,res,next)=>{
      try {
        const branchQuery = "select Branch_id,Branch_Name from branch";
        const branch = await sequelize.query(branchQuery, {
          type: sequelize.QueryTypes.SELECT,
        });
        res.json(branch);
      } catch (error) {
        console.log("/branch=>",error);
        next(error);
        res.json(error);
      }
    }

  export const branchname = async(req,res)=>{
    try{
      const user_id = req.params.user_id;
      console.log("/branchname/userid ",user_id);
      const branchname = `SELECT b.branch_name,b.Branch_id FROM branch b 
      JOIN user m ON b.branch_id = m.branch_id WHERE b.branch_id = m.branch_id 
      AND m.user_id = ?;`;
      const filesParams = [];
      filesParams.push(user_id);
      const branch = await sequelize.query(branchname, {
        type: sequelize.QueryTypes.SELECT,
        replacements: filesParams,
      });

      res.status(200).send({
        branch
      });
    }catch(err){
      console.error(err);
      res.status(500).send({
        message: "Error occurred while fetching the pending requests"
      });
    } 
  }

  export const items = async(req,res)=>{
    try {
      console.log("items")
      const itemQuery = "select item_id,item_name,c.cat_id,cata_Name,price from item i left join catagory c on c.cat_id = i.cat_id";
      const items = await sequelize.query(itemQuery,{type: sequelize.QueryTypes.SELECT});
      res.status(200).json(items);
    } catch (error) {
      res.json(err);
    }
  }

  export const oneitem = async(req,res)=>{
    try {
      const itemQuery = "select `item_id`,`item_name`,`price`,item.cat_id,cata_Name from item Left JOIN catagory c ON item.cat_id = c.cat_id WHERE item.cat_id = ?";
      const itemQuerys = "select `item_id`,`item_name`,`price`,item.cat_id,cata_Name from item Left JOIN catagory ON item.cat_id =catagory.cat_id";
      const cat_id = req.params.cat_id;
      const filesParams = [];

      if(cat_id ==-1){
        const item = await sequelize.query(itemQuerys, {
          type: sequelize.QueryTypes.SELECT,
        });
        res.status(200).jsonjson(item);
      }else{

      filesParams.push(cat_id);
      const items = await sequelize.query(itemQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: filesParams,
      });
        res.json(items);
      }
    } catch (error) {
      res.json(error);
    }
  }

  export const cats = async(req,res)=>{
    try {
      const catQuery = "select *from catagory";

      const cats = await sequelize.query(catQuery, {
        type: sequelize.QueryTypes.SELECT,
      });
      res.json(cats);
    } catch (error) {
      res.json(err);
    }
  }

