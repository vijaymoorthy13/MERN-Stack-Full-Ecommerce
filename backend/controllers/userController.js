const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require('crypto');
const cloudinary = require("cloudinary");

//Register a user
exports.registerUser = catchAsyncError(async (req,res,next) => {

   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, { 
         folder:"avatars",
         width:150,
         crop:"scale",
         resource_type: 'image',
        
   });

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,            
            url:myCloud.secure_url,
        },
    });
    
    sendToken(user,201,res);   //it contains token and cookie 
});


//LOGIN USER

exports.loginUser = catchAsyncError(async(req,res,next) => {
  
    const {email,password} = req.body;
    //checking if user given email and passowd both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email && Password",400))
    }

    const user = await User.findOne({ email }).select("+password");
   
   if(!user){
       return next(new ErrorHandler("Invalid Email or Password",401));
   }

   const isPasswordMatched = await  user.comparePassword(password);
   

   if(!isPasswordMatched){
       return next(new ErrorHandler("Invalid Email or Password",401));
   }

   sendToken(user,200,res);  //it contains token and cookie 

});

//LOGOUT
exports.logout = catchAsyncError(async(req,res,next) => {

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged Out"
    });
});

//FORGOT PASSWORD
exports.forgotPassword = catchAsyncError(async(req,res,next) => {
    
    const user = await User.findOne({ email:req.body.email });

   if(!user){
       return next(new ErrorHandler("user not found",404));
   }

   //get ResetPasswordToken 
   const resetToken = user.getResetPasswordToken();
   
   await user.save({validateBeforeSave:false});


   const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

   const message = `Your password reset link is :-  \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, Please Ignore it`


   try{
     
       await sendEmail({
            email:user.email,
            subject:`Shopping Store Password Recovery`,
            message,

       });
  
       res.status(200).json({
           success:true,
           message:`Email sent to ${user.email} successfully`,
       })


   }catch(error){
       user.resetPasswordToken = undefined;
       user.resetPasswordExpire = undefined;

       await user.save({validateBeforeSave:false});
       console.log(error)
       return next(new ErrorHandler(error.message,500));
       
   }
});

//RESET PASSWORD LINK

exports.resetPassword = catchAsyncError(async(req,res,next) => {

    //creating token hash
    const resetPasswordToken = crypto
          .createHash("sha256")
          .update(req.params.token)
          .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now() },
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400))
   
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("password and confirm password not matching",400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res); 
});

//GET USER DETAILS
exports.getUserDetails = catchAsyncError(async(req,res,next) => {

  const user = await User.findById(req.user.id);

   res.status(200).json({
       success:true,
       user,       
   });   
});


//UPDATE USER PASSWORD
exports.updateUserPassword = catchAsyncError(async(req,res,next) => {
    
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is Incorrect",400));
    }
 
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password not matched",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
        
});

///Update user profile
exports.updateProfile = catchAsyncError(async(req,res,next) => {
       
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    };

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);
        
        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, { 
            folder:"avatars",
            width:150,
            crop:"scale",
            resource_type: 'image',        
      });

      newUserData.avatar = {
        public_id:myCloud.public_id,            
        url:myCloud.secure_url,
      };

    }
    
    const user = await User.findByIdAndUpdate(req.user.id,newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success:true,
    });        
});


//get All users (admin)
exports.getAllUsers = catchAsyncError(async(req,res,next) => {
   const users = await User.find();

   res.status(200).json({
       success:true,
       users,
   });
});


//get single user (admin)
exports.getSingleUser = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.params.id);
 
    if(!user){
        return next(new ErrorHandler(`user does not exist with id : ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user,
    });
 });


 ///Update USER ROLE ----ADMIN
exports.updateUserRole  = catchAsyncError(async(req,res,next) => {
       
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };

        await User.findByIdAndUpdate(req.params.id,newUserData, {
            
        new:true,
        runValidators:true,        
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
    });        
});



///delete USER  ----ADMIN
exports.deleteUser = catchAsyncError(async(req,res,next) => {
       
    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
        );
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User deleted Successfully"
    });        
});