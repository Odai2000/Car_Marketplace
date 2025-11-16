const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const notificationController = require("../controllers/notificationController");

router
  .route("/")
  .get(authenticateToken, notificationController.getNotificationsByUserId)
  .post(notificationController.createNotification); //might not be used by client

router
  .route("/:_id")
  .get(authenticateToken, notificationController.getNotificationById)
  .delete(authenticateToken, notificationController.deleteNotification);
router
  .route("/:_id/read")
  .patch(authenticateToken, notificationController.readNotification);
module.exports = router;
