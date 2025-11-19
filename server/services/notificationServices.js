const Notification = require("../models/Notification");
const User = require("../models/User");

async function createNotification(noti) {
  let { user_id, message, actor, link,payload } = noti;
  
  if (!message && actor?.user) {
    const actorPopulated = await User.findById(actor.user);
    switch (actor.action) {
      case "comment":
        message = `${actorPopulated.name} commented on your post: ${payload.text}`;
        break;
      case "reply":
        message = `${actorPopulated.name} replied to your comment:${payload.text}`;
        break;
      case "bid":
        message = `${actorPopulated.name} made you an offer!`;
        break;
      default:
        message = "";
    }
  }

  const created = await Notification.create({
    user_id,
    actor,
    message,
    link,
  });

  return Notification.findById(created._id).populate("actor.user", "firstName lastName name profileImageId profileImageUrl")
}

module.exports = { createNotification };
