const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "temp/" });
router
  .route("/")
  .get(authenticateToken, userController.getAllUsers)
  .post(userController.createUser)
  .patch(authenticateToken, userController.updateUser)
  .delete(authenticateToken, userController.deleteUser);

router.route("/me").get(authenticateToken, userController.getUserPersonalData);
router
  .route("/me/saved-posts")
  .get(authenticateToken, userController.getSavedPosts);
router
  .route("/me/change-password")
  .patch(authenticateToken, userController.changePassword);

router.route("/:_id").get(userController.getUser);

router.route("/:_id/verify-email").post(userController.verifyEmail);

router
  .route("/:_id/save-post")
  .post(authenticateToken, userController.savePost);

router
  .route("/:_id/unsave-post")
  .post(authenticateToken, userController.unsavePost);

router.route("/:_id/rate").post(authenticateToken, userController.rateUser);

router.patch(
  "/:id/profile-image",
  authenticateToken,
  upload.single("image"),
  userController.updateProfileImage
);

router
  .route("/:_id/resend-email-verification")
  .get(authenticateToken, userController.resendEmailVerification);

router.route("/login").post(userController.loginUser);

router.route("/logout").post(userController.logout);

router.route("/token").post(userController.refreshTheToken);

module.exports = router;
