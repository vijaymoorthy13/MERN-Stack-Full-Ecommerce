import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate,Outlet } from 'react-router-dom'

const ProtectedRoute = ({adminRoute, children, isAdmin  }) => {

  const {loading, isAuthenticated, user} = useSelector((state) => state.user)

  if(!isAuthenticated){
     return <Navigate to="/login"/>      
  }
  if(adminRoute && !isAdmin){
    return <Navigate to="/login"/>      
  }
   
  return (
    
      children ? children : <Outlet/>
    
  )
}

export default ProtectedRoute

   {/*        
    <Fragment>
 
         {loading === false && (
                isAuthenticated === false ? <Navigate to="/login" /> : isAdmin ? user.role !== "admin" ? <Navigate to="/login" /> : children : children
            )}                                   
            
    </Fragment>
    */}