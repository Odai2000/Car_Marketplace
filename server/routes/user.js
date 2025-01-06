const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(authenticateToken, userController.getAllUsers)
  .get(authenticateToken, userController.getUserPersonalData)
  .post(userController.createUser)
  .patch(authenticateToken, userController.updateUser);

router
  .route("/:id")
  .get(authenticateToken, userController.getUserByid)
  .delete(authenticateToken, userController.deleteUser);

router.route("/me").get(authenticateToken, userController.getUserPersonalData);

router.route("/login").post(userController.loginUser);

router.route("/token").post(userController.refreshToken);

module.exports = router;
