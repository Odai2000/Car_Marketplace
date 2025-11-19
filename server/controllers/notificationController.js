const Notification = require("../models/Notification");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// notice: check weather mods should be allowed to access user notifications
const createNotification = asyncHandler(async (req, res) => {
  const { user_id, message, link } = JSON.parse(req.body.data);

  if (!user_id || !message)
    return res.status(400).json({ message: "Invalid input." });

  if (!(await User.findById(user_id)))
    return res
      .status(400)
      .json({ message: `No user with id: ${user_id} was found.` });

  const notification = await Notification.create({ user_id, message, link });

  if (!notification)
    return res.status(500).json({ message: "Failed to created notification." });

  return res.status(201).json({ message: "Notification created" });
});

const getNotificationById = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  if (!_id) return res.status(400).json({ message: "Invalid input." });
  const notification = await Notification.findById(_id);

  if (!notification)
    return res
      .status(404)
      .json({ message: `No notification with id ${_id} was found.` });

  return res.status(200).json(notification);
});

const getNotificationsByUserId = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { page, limit } = req.query || 1;

  if (!user_id) return res.status(400).json({ message: "Invalid inpuut." });
  const totalNotifications = await Notification.find({
    user_id,
  }).countDocuments({ user_id });
  const notifications = await Notification.find({ user_id })
    .populate("actor.user", "firstName lastName name profileImageId profileImageUrl")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(page * limit)
    .exec();

  if (!(await User.findById(user_id)))
    return res
      .status(404)
      .json({ message: `No user with id: ${user_id} was found.` });

  return res.status(200).json({ notifications, totalNotifications });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const user_id = req.user._id;

  const notification = await Notification.findById(_id);
  if (!notification)
    return res
      .status(404)
      .json({ message: `No notification with id: ${_id} was found.` });

  if (notification.user_id.toString() != user_id)
    return res.status(403).json({ message: "Forbidden action" });

  const result = await Notification.deleteOne({ _id });

  if (!result)
    return res
      .status(500)
      .json({ message: `Failed to delete notififcation with id: ${_id}.` });

  return res.status(200).json({ message: "Notification deleted." });
});

const readNotification = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const user_id = req.user._id;

  if (!_id) return res.status(400).json({ message: "Invalid input." });

  const notification = await Notification.findById(_id);

  if (!notification)
    return res
      .status(404)
      .json({ message: `No notification with id: ${_id} was found.` });

  if (notification.user_id.toString() != user_id.toString())
    return res.status(403).json({ message: "Foribbden action." });

  notification.hasRead = true;

  const updated = await notification.save();

  return res
    .status(200)
    .json({ message: "Notification updated.", notification: updated });
});

module.exports = {
  createNotification,
  getNotificationById,
  getNotificationsByUserId,
  readNotification,
  deleteNotification,
};
