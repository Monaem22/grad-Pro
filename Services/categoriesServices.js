
const factory = require('./HandlerFactory.js');
const Category = require('../models/categories.js');



exports.getCategories = factory.getAll(Category);


exports.getCategory = factory.getOne(Category);


exports.createCategory = factory.createOne(Category);


exports.updateCategory = factory.updateOne(Category);


exports.deleteCategory = factory.deleteOne(Category);