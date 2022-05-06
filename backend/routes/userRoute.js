const express = require("express");
const {  registerUser, 
         loginUser, 
         logout, 
         forgotPassword, 
         resetPassword, 
         getUserDetails, 
         updateUserPassword, 
         updateProfile, 
         getAllUsers, 
         getSingleUser, 
         updateUserRole, 
         deleteUser
        } = require("../controllers/userController")

const router = express.Router();
const {isAuthenticateUser,authorizeRoles} = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout); 

router.route("/me").get(isAuthenticateUser,getUserDetails); 

router.route("/password/update").put(isAuthenticateUser, updateUserPassword); 

router.route("/me/update").put(isAuthenticateUser, updateProfile); 

router.route("/admin/users").get(isAuthenticateUser, authorizeRoles("admin"), getAllUsers); 

router.route("/admin/user/:id").get(isAuthenticateUser, authorizeRoles("admin"), getSingleUser)
                               .put(isAuthenticateUser, authorizeRoles("admin"), updateUserRole)
                               .delete(isAuthenticateUser, authorizeRoles("admin"), deleteUser)  

module.exports = router;