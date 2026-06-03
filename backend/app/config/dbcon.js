
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const MONGO_URL = process.env.MONGODB_URL;

const DatabaseConnection = async()=>{
    try{
        const conn = await mongoose.connect(MONGO_URL);
        if(conn){
            console.log('Database connected');  
        }else{
            console.log('Database not connected');
            
        }
    }catch(error){
        console.log(error);
        
    }
}

module.exports= DatabaseConnection;