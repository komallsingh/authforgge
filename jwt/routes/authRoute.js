const express= require("express");
const router= express.Router();

const authController= require("../controllers/authCont"); //gets the functions from authCont.js

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router; //exports the router to be used in other files, such as the main application file (app.js or server.js).

//controler has many function,
// When a request comes to a specific URL, call the appropriate controller function."