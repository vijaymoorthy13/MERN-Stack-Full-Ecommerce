const express = require("express");
const app= express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

//config
dotenv.config({path:"backend/config/.env"})

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({limit:"50mb", extended:true}));
app.use(fileUpload());

//Route  import 
const product = require('./routes/productRoute');
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1/",product);    
app.use("/api/v1/",user);
app.use("/api/v1/",order);     
app.use("/api/v1/",payment);     

//middleware for errors 
app.use(errorMiddleware);



module.exports = app