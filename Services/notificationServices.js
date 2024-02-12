
const factory = require("./HandlerFactory.js");
const notification = require("../models/notification .js");


exports.getnotifications = factory.getAll(notification);

exports.getnotification = factory.getOne(notification);

exports.createnotification = factory.createOne(notification);

exports.updatenotification = factory.updateOne(notification);

exports.deletenotification = factory.deleteOne(notification);