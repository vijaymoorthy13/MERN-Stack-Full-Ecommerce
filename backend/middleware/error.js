const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal Server Error";
  

//Wrong Mongo Id error

if(err.name === "CastError"){
     message = `Resource not found. Invalid: ${err.path}`;    
     err = new ErrorHandler(message, 400);

}

//MONGOOSE DUPLICATE KEY ERROR
if(err.code === 11000 ){
   const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;   
    err = new ErrorHandler(message, 400);
}


//WRONG JWT ERROR
if(err.name === "JsonWebTokenError"){
   const message = `Json Web Token is invalid, Try again`;   
    err = new ErrorHandler(message, 400);
}

if(err.name === "TokenExpiredError"){
    const message = `Json Web Token is Expired, Try again`;   
     err = new ErrorHandler(message, 400);
 }


    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};

