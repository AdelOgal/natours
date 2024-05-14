//WE ONLY USE THE app.js TO CONFIGURE OUR APPLICATION
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const cookieParser = require('cookie-parser');

// Start express app
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global Middlewares

/*
^---------------------- Serving static files ----------------------
*/

app.use(express.static(path.join(__dirname, 'public')));

/*
^---------------------- Set Security HTTP Headers----------------------
*/
app.use(helmet());
/*
^----------------------Development Logging----------------------
*/
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/*
^----------------------Limit requests from same API----------------------
*/
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour.',
});
app.use('/api', limiter);

/*
^----------------------Body parser, reading data from the body into req.body----------------------
*/

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

/*
^-------------------Data sanitization against NoSQL query injection-----------------
*/

app.use(mongoSanitize());
/*
^----------------------Data Sanitization Against XSS----------------------
*/

app.use(xss());

/*
^----------------------Prevent Parameter Pollution----------------------
*/

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

/*
^----------------------Test Middleware----------------------
*/
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//3) ROUTES
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "img-src 'self' data: https://*.tile.openstreetmap.org;",
  );
  return next();
});
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://*.cloudflare.com/',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js',
  'https://js.stripe.com',
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://*.cloudflare.com/',
  'https://bundle.js:*',
  'ws://localhost:*/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Adjusted to allow 'self' by default
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: ["'none'"],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      frameSrc: ["'self'", 'https://js.stripe.com'], // Add this line
    },
  }),
);
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//this should be the last part of your routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
//4) Start The Server
module.exports = app;

//leftover code
// app.get(`/`, (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.status(200).send('You can post to this endpoint');
// });

//2) Route Handlers

//Route Handler Function

// old way of doing things
// app.get('/api/v1/tours', getAllTours);

// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours/:id', getTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

//the below way is way cleaner, same output
