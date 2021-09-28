require('dotenv').config();

const mongoose = require('mongoose');


function connectDB() {
  //Database connection 

  mongoose.connect(process.env.MONGO_CONNECTION_URL, { useUnifiedTopology: true });

   const connection = mongoose.connection;
   connection.on('connected', function () {
    console.log('Database connected');
  });

  mongoose.connection.on('error', function (err) {
    console.log('Connection failed:' + err);
  }); 
  
}



module.exports = connectDB;