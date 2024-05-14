const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'Tour name cannot be more than 40 characters'],
      minLength: [10, 'Tour name cannot be less than or equal to 3 characters'],
      // USING VALIDATOR LIBRARY: validate: [validator.isAlpha, 'Tour name can only contain letters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Please add a duration'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },

      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    maxGroupSize: {
      type: Number,
      required: [true, 'Please add a group size limit'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please provide a difficulty'],
      //enum is for the ONLY values it can take
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //THIS FUNCTIONS DOES NOT WORK WITH UPDATE TOUR, ONLY WHEN CREATING A TOUR. MEANING IT ONLY POINTS TO THE CURRENT DOC. IT IS A MONGOOSE CAVEAT
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below original price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A summary is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Cover Image is required'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// 1 ascending order, -1 descending order
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//Virtual Populate, connecting two models together
tourSchema.virtual('reviews', {
  ref: 'Review',
  //foreign field is the name of the field in the  other model(review) where the reference to the current model os stored, which is the tour field from the review model.
  foreignField: 'tour',
  //this is how it is called in the local model
  localField: '_id',
});

//Document Middleware, runs before .save() and .create()

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//responsible for embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
//
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE, before query execution
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__V -passwordChangedAt',
  });

  next();
});

//QUERY MIDDLEWARE, after query execution
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(docs);
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

//AGGREGATION MIDDLEWARE

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
