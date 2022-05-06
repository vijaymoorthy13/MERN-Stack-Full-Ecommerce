import React from 'react'
import { Navbar } from 'responsive-navbar-react';
import 'responsive-navbar-react/dist/index.css';


const Header = () => {
  
  const props = {
   
    items: [      
      {
        text: 'Home',
        link: '/'
      },
      {
        text:"Profile",
        link:"/account",
      },      
      {
        text:"Search",
        link:"/search"
      },
      {
        text: 'Products',
        link: '/products'
      },
      {
        text: 'About',
        link: '/about'
      },
      {
        text: 'Contact',
        link: '/contact'
      },
      {
        text: 'Login',
        link: '/login'
      },     
    ],  
    logo: {      
      text: 'ECommerce',
      link:"/"
    },
    style: {
      barStyles: {
        background: 'dodgerblue'
      },
      sidebarStyles: {
        background: '#222',
        buttonColor: 'white'
      },
      float:true
    }
  }


  return (
    <div className="home">
    	<Navbar {...props}/>
    </div>
  )
}

export default Header