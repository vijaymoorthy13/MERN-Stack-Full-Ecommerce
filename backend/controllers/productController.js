const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures.js");
const cloudinary = require("cloudinary"); 

//CREATE PRODUCT --- ADMIN
exports.createProduct = catchAsyncError(async(req,res,next) => {

   let images =[];

   if(typeof req.body.images === "string"){
      images.push(req.body.images)
   }else{
      images = req.body.images;
   }

   const imagesLink =[];

   for(let i =0; i<images.length; i++){
       const result = await cloudinary.v2.uploader.upload(images[i],{
           folder:"products",
       });
       imagesLink.push({
           public_id : result.public_id,
           url : result.secure_url,           
       });
   }
  
    req.body.images = imagesLink;
    req.body.user= req.user.id;   
    
   const product =  await Product.create(req.body);

   res.status(201).json({
       sucess:true,
       product
   });
});

//GET ALL PRODUCTS
exports.getAllProducts = catchAsyncError(async(req,res) => {

    
     const resultPerPage = 8;  
     const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()

    let products = await apiFeature.query;
    
    let filteredProductsCount = products.length;
    
    apiFeature.pagination(resultPerPage)


    products = await apiFeature.query.clone();

    res.status(200).json({
        sucess:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
});

//GET ALL PRODUCTS ==== ADMIN
exports.getAdminProducts = catchAsyncError(async(req,res) => {

   const products = await Product.find()    
    
   res.status(200).json({
       sucess:true,
       products,       
   })
});


//GET SINGLE PRODUCT DETAILS
exports.getProductDetails = catchAsyncError(async(req,res,next) => {
    const product = await Product.findById(req.params.id);
  
    if(!product){
        return next(new ErrorHandler("product not found",400)) //middleware error handler
    }

    res.status(200).json({
        success:true,    
        product,                
    })
});

//UPDATE PRODUCT == ADMIN
exports.updateProduct = catchAsyncError(async(req,res,next)=>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("product not found",400)) //middleware error handler
    }

    //images Start here
    let images= []

    if(typeof req.body.images === "string"){
        images.push(req.body.images)
     }else{
        images = req.body.images;
     }

     if(images !== undefined){

        //deleting images from cloudinary
    for(let i=0; i < product.images.length; i++){
         
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
   }

   const imagesLink =[];

   for(let i =0; i<images.length; i++){
       const result = await cloudinary.v2.uploader.upload(images[i],{
           folder:"products",
       });
       imagesLink.push({
           public_id : result.public_id,
           url : result.secure_url,           
       });
   }
  
    req.body.images = imagesLink;    

     }

   product = await Product.findByIdAndUpdate(req.params.id,req.body,{
       new:true,
       runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"Product Updated Successfully",
        product        
    })
});

//DELETE PRODUCT
exports.deleteProduct = catchAsyncError(async(req,res,next) =>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("product not found",400)) //middleware error handler
    }
     

    //deleting images from cloudinary
    for(let i=0; i < product.images.length; i++){
         
         await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();

    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    });
});

//CREATE NEW REVIEW OR UPDATE THE REVIEW
exports.createProductReview = catchAsyncError(async (req,res,next) =>{
    const {rating,comment, productId} = req.body;

    const review ={
        user: req.user._id,
        name:req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
        );

    if(isReviewed){
       product.reviews.forEach((rev) => {
           if(rev.user.toString() === req.user._id.toString())
           (rev.rating = rating),
           (rev.comment = comment)
       });                   
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
  

    let avg = 0;

      product.reviews.forEach((rev) => {
          avg += rev.rating  // avg = avg+rev.rating          
      })
      product.ratings = avg / product.reviews.length;

      await product.save({ validteBeforeSave:false });

      res.status(200).json({
           success:true,
      });   
});


//GET ALL REVIEWS OF PRODUCT
exports.getProductReview = catchAsyncError(async (req,res,next) =>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("product not Found",400));
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews,
    });
});
 
//DELETE REVIEWS OF PRODUCT
exports.deleteReview = catchAsyncError(async (req,res,next) =>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("product not Found",400));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString())

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating  // avg = avg + rev.rating             
    })  

    let ratings = 0

    if(reviews.length === 0){
        ratings = 0;        
    }else{
        ratings = avg / reviews.length;
    }
    
    
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
    },{
        new: true,
        runValidators:true,
        useFindAndModify:false, 
    });

    res.status(200).json({
        success:true,
        reviews: product.reviews,
    });
});