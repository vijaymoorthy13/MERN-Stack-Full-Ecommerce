//craeting token and saving in cookie 

const sendToken = (user,statusCode,res)=>{

    const token = user.getJWTToken();

    //options for cookie

    const options = {
        expires:new Date(
            Date.now + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // totally 86400 seconds in a day 
        ),
        htttpOnly:true,
    };
   res.status(statusCode).cookie("token",token,options).json({
       success:true,
       user,
       token,
   }); 
};

module.exports = sendToken;


// 60 100 = 60 second
//60(60 1000) = 60 mins // 1 hour
//24(60(60 1000)) = 1day // 24hour  