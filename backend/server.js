const app = require("./app")
const dotenv = require("dotenv")
const connectDatabse = require("./config/database")
const cors = require("cors");   
const cloudinary = require("cloudinary");
//Uncaught Exception Handling
process.on("uncaughtException",err => {
    console.log(`Error: ${err.message}`);
    console.log("Server is shutting down due to uncaught Exception")
    process.exit(1);
    });

 app.use(cors());      
//config
dotenv.config({path:"backend/config/.env"})

//connect Database
connectDatabse();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT,() => {
    console.log(`server is running on the port ${process.env.PORT}`)
})


//unhandled promise rejection
process.on("unhandledRejection",err => {
    console.log(`Error: ${err.message}`);
    console.log("Server is shutting down due to unhandled Promise Rejection")

    server.close(() => {
        process.exit(1);
    });
});