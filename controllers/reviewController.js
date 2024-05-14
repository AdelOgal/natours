const Review = require('./../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const APIFeatures = require('./../utils/apiFeatures');

// const AppError = require('./../utils/appError');

//Middleware that was inside of createReview
exports.setTourUserIds = (req, res, next) => {
  //Allow Nested Routes, user can manually define tour user id. if not specified, we run the below if statements
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.UpdateReview = factory.updateOne(Review);
exports.DeleteReview = factory.deleteOne(Review);

