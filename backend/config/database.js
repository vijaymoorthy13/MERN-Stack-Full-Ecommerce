const mongoose = require("mongoose");

const connectDatabse =() => {
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,        
    }).then((data) => {
        console.log(`Mongo Db connected ${data.connection.host}`);
    });
};


module.exports = connectDatabse