const mongoose = require('mongoose');
const Tour = require('./tourModel');
const slugify = require('slugify');
const validator = require('validator');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// to ensure users can not write multiple reviews for the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });

  //   next();

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      //stats is an array, so we use stats[0].nRating to access the actual rating, then register it on Compass, instead of the default values
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      //stats is an array, so we use stats[0].nRating to access the actual rating, then register it on Compass, instead of the default values
      //below are default values when there are no reviews at all, to avoid an error, we did an if statement,
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  //this keyword points to current review
  this.constructor.calcAverageRatings(this.tour); //we used constructor because Review is not yet declared. this.constructor points to the current MODEL.
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  //the below code retrieves the current doc, then we store it in the query variable, this. CHECK LIN 97 FOR CONTINUATION.
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});
// connecting the above middleware with the one below
reviewSchema.post(/^findOneAnd/, async function () {
  // we then get access to it in POST middleware. Then we calculate the stats for reviews
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
// make sure this is always at the end of ur code, write nothing between const Review and module.exports
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
