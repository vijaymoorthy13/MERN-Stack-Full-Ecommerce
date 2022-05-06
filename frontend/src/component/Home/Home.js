import React, { Fragment, useEffect } from "react";
import {FaArrowCircleDown} from "react-icons/fa";
import "./Home.css";
import Carousel from "react-material-ui-carousel";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import {clearErrors, getProduct} from "../../actions/productAction";
import { useSelector,useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import {useAlert} from "react-alert"
import bg from "../../images/background.jpg";
import bg2 from "../../images/background2.jpg";


const Home = () => {

  const alert = useAlert()
  const dispatch = useDispatch()
  const {loading,error,products} = useSelector((state) => state.products);

  useEffect(() =>{
   if(error){
     alert.error(error)
     dispatch(clearErrors());
   }
    dispatch(getProduct());
  },[dispatch,error,alert]);

  return (
    <Fragment>      
      {loading ? <Loader/>:   <Fragment>
          
          <MetaData title="ECOMMERCE WEBSITE"/>
     
               <div className="banner">
               <Carousel>
                 <img src={bg} className="bgImg" alt={bg}/>
                 <img src={bg2} className="bgImg" alt={bg2}/>
               </Carousel>
             <div className="home__content">
               <div className="home_free" style={{                 
                 display:"flex",
                 alignItems:"center",
               }}>
               <h2  style={{
                 fontFamily: "Segoe Script",
                 fontSize: "3em",
                 fontWeight:"500"
               }}>Buy 2 Get</h2>               
               </div>
               <div className="home_fashion">
                 <h2 style={{
                   fontSize:"4.5em",
                   fontFamily:"Poppins,sans-serif",
                   color:"#fff",
                 }}>Fashionable</h2>
               </div>
               <div className="home_fashion">
                 <h2 style={{
                   fontSize:"4.5em",
                   fontWeight:"400",
                   fontFamily:"Poppins,sans-serif",
                   color:"#fff",
                   lineHeight:".7"
                 }}>Collection</h2>
               </div>
               <div>
                 <h2
                 style={{
                   fontWeight:"400",
                   fontFamily:"Poppins,sans-serif",
                   color:"#fff",
                   fontSize:"1em",
                   paddingTop:"10px"
                 }}
                 >
                 Get Free Shipping on all orders over ₹99.00
                 </h2>
               </div>
               <div>
                 <a href="#container">
                 <button type="submit" style={{
                   width:"60px",
                   height:"40px",
                   border:"none",
                   background:"#3BB77E",
                   margin:"10px 0",
                   fontSize:"1vmax",
                   color:"#fff",
                   cursor:"pointer"
                 }}
                 className="Home__button"
                 >SHOP NOW</button>
                 </a>
               </div>
             </div>
         </div>
 
     
               <h2 className="homeHeading">Featured Products</h2>
     
               <div className="container" id="container">
                    {products && products.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                    
               </div>
             </Fragment>}
      
    </Fragment>
  );
};

export default Home;
