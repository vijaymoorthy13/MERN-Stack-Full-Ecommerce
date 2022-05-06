import './App.css';
import Header from './component/layout/Header/Header.js';
import  {BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home';
import ProductDetails from './component/Product/ProductDetails';
import Products from './component/Product/Products';
import Search from './component/Product/Search';
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import WebFont from "webfontloader";
import React, { useEffect, useState } from "react";
import UserOptions from './component/layout/Header/UserOptions';
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile';
import ProtectedRoute from "./component/Route/ProtectedRoute"
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import axios from "axios";
import Payment from "./component/Cart/Payment";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import NotFound from './component/layout/NotFound/NotFound';



function App() {

  const {isAuthenticated,user} = useSelector((state) => state.user);

  const [stripeApiKey,setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const {data} = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(()=>{
    WebFont.load({
       google:{
         families:["Roboto","Droid Sans","Chilanka"],
       },
    });

    store.dispatch(loadUser());

    getStripeApiKey();  
  },[])

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <BrowserRouter>
        <Header/>                  
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>                      
           <Route exact path={"/"} element={<Home/>}/>
           <Route  path={"/product/:id"} element={<ProductDetails/>}/>
           <Route  path={"/products"} element={<Products/>}/>
           <Route  path={"/products/:keyword"} element={<Products/>}/>
           <Route  path={"/search"} element={<Search/>}/>
           <Route  path={"/contact"} element={<Contact/>}/>
           <Route  path={"/about"} element={<About/>}/>

           <Route  path={"/login"} element={<LoginSignUp/>}/>
           <Route  path={"/account"} element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
           <Route  path={"/me/update"} element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>
           <Route  path={"/password/update"} element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>
           <Route  path={"/password/forgot"} element={<ForgotPassword/>}/>
           <Route  path={"/password/reset/:token"} element={<ResetPassword/>}/>                                 
           <Route  path={"/cart"} element={<Cart/>}/>
           <Route  path={"/shipping"} element={<ProtectedRoute><Shipping/></ProtectedRoute>}/>
           <Route  path={"/success"} element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
           <Route  path={"/orders"} element={<ProtectedRoute><MyOrders/></ProtectedRoute>}/>
           <Route  path={"/order/confirm"} element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}/>
           <Route  path={"/order/:id"} element={<ProtectedRoute><OrderDetails/></ProtectedRoute>}/>

          <Route  path={"/process/payment"} element={

                  <ProtectedRoute>
                    {stripeApiKey && (  
                       <Elements stripe={loadStripe(stripeApiKey)}> <Payment/> </Elements> 
                       )}
                   </ProtectedRoute> }/> 
     
     
           <Route isAdmin={true} path={"/admin/dashboard"}  element={<ProtectedRoute> <Dashboard/></ProtectedRoute>}/>
          

           <Route isAdmin={true} path={"/admin/products"} element={<ProtectedRoute>  <ProductList/></ProtectedRoute>}/>

           <Route isAdmin={true} path={"/admin/product"} element={<ProtectedRoute><NewProduct/></ProtectedRoute>}/>

           
           <Route isAdmin={true} path={"/admin/product/:id"} element={<ProtectedRoute><UpdateProduct/></ProtectedRoute>}/>

           <Route isAdmin={true} path={"/admin/orders"} element={<ProtectedRoute><OrderList/></ProtectedRoute>}/>

           <Route isAdmin={true} path={"/admin/order/:id"} element={<ProtectedRoute><ProcessOrder/></ProtectedRoute>}/>

           <Route isAdmin={true} path={"/admin/users"} element={<ProtectedRoute><UsersList/></ProtectedRoute>}/>

           <Route isAdmin={true} path={"/admin/user/:id"} element={<ProtectedRoute><UpdateUser/></ProtectedRoute>}/>
           
           <Route isAdmin={true} path={"/admin/reviews"} element={<ProtectedRoute><ProductReviews/></ProtectedRoute>}/>
 
          <Route path="*" element={window.location.pathname === "/process/payment" ? null : <NotFound/> } />
  
         </Routes>
        <Footer/>
  </BrowserRouter>
  )
}

export default App;
