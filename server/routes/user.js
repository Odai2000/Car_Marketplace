const userController = require("../controllers/userController");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  
router
  .route("/:id")
  .delete(userController.deleteUser)
  
module.exports = router;
