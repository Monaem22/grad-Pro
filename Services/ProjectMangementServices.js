const factory = require('./HandlerFactory.js');
const Project_warehouse = require('../models/projects_WarehouseModel.js');

exports.getallProject_warehouse = factory.getAll(Project_warehouse);


exports.getProject_warehouse = factory.getOne(Project_warehouse);


exports.createProject_warehouse = factory.createOne(Project_warehouse);


exports.updateProject_warehouse = factory.updateOne(Project_warehouse);


exports.deleteProject_warehouse = factory.deleteOne(Project_warehouse);