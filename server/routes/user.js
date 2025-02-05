const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(authenticateToken, userController.getAllUsers)
  .post(userController.createUser)
  .patch(authenticateToken, userController.updateUser);

router.route("/me").get(authenticateToken, userController.getUserPersonalData);

router
  .route("/me/change-password")
  .patch(authenticateToken, userController.changePassword);

router
  .route("/:_id")
  .get(authenticateToken, userController.getUser)
  .delete(authenticateToken, userController.deleteUser);

 router
  .route("/:_id/verify-email/:token")
  .get(userController.verifyEmail)
  
router
  .route("/:_id/resend-email-verification")
  .get(authenticateToken, userController.resendEmailVerification)

router.route("/login").post(userController.loginUser);

router.route("/token").post(userController.refreshTheToken);

module.exports = router;
