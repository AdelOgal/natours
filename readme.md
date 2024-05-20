<h1 align="center">
  <br>
  <a href="https://natours-u2q8.onrender.com/"><img src="public/img/logo-green.png" alt="Natours" width="200"></a>
  <br>
  Natours Project
  <br>
</h1>

<h4 align="center">A tour-booking site built using <a href="https://nodejs.org/en/" target="_blank">NodeJS</a>.</h4>

 <p align="center">
 <a href="#deployed-version">Demo</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#update-your-profile">Update your profile</a> •
  <a href="#api-usage">API Usage</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#build-with">Build With</a> •
  <a href="#future-improvements">Future Improvements</a> •
  <a href="#installation">Installation</a> • 
  <a href="#acknowledgement">Acknowledgement</a>
</p>

## Deployed Version

Live demo (Feel free to visit) 👉 : https://natours-u2q8.onrender.com/

## Key Features

- Authentication and Authorization
  - Sign-up, Login and logout
- Tour
  - Manage booking, check tours map, check user's reviews and ratings
- User profile
  - Update username, profile photo, email, and password
- Credit card payment using Stripe

## How To Use

### Book a tour

- Login or Sign-up to the site
- Search for tours to book
- Book a tour
- Proceed to the payment using Stripe
- Enter the card details (Test Mode):
  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: any
  - CVV: any
  ```
- Finished!

### Manage your booking

- Check the tour you have booked in "Manage Booking" page in your user settings. You'll be automatically redirected to this
  page after you have completed the booking.

### Update your profile

- You can update your own username, profile photo, email and password.

## API Usage

Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add:

```
- {{URL}} with your hostname as value (e.g. http://127.0.0.1:3000)
- {{password}} with your user password as value.
```

Check the [Natours API Documentation](https://documenter.getpostman.com/view/33552804/2sA3BkcCrd#b3bdfb6e-52b8-4df9-9bc5-2d6e0664cdd7) for more info.

<b> API Features: </b>

Tours List 👉 https://natours-u2q8.onrender.com/api/v1/tours

Tours Statistics 👉 https://natours-u2q8.onrender.com/api/v1/tours/tour-stats

Get Top 5 Cheap Tours 👉 https://natours-u2q8.onrender.com/api/v1/tours/top-5-cheap

Get Tours Within Radius 👉 https://natours-u2q8.onrender.com/api/v1/tours/tours-within/200/center/34.098453,-118.096327/unit/mi

## Deployment

The website is deployed using git on render.com. Below are the steps taken:

```
git init
git add -A
git commit -m "Commit message"
git push origin master

deploy on render > web service
```

Set environment variables to render:

```
go to dashboard > project > environment
```

## Build With

- [NodeJS](https://nodejs.org/en/) - JS runtime environment
- [Express](http://expressjs.com/) - The web framework used
- [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
- [Pug](https://pugjs.org/api/getting-started.html) - High performance template engine
- [JSON Web Token](https://jwt.io/) - Security token
- [esbuild](https://esbuild.github.io/) - An extremely fast bundler for the web
- [Stripe](https://stripe.com/) - Online payment API
- [Postman](https://www.getpostman.com/) - API testing
- [Mailtrap](https://mailtrap.io/) & [Mailgun](https://www.mailgun.com/) - Email delivery platform
- [Render](https://render.com/) - Cloud platform

## Future Improvements

- Review and rate
  - Allow user to add a review directly at the website after they have booked a tour
- Booking
  - Prevent duplicate bookings after user has booked that exact tour, implement favorite tours
- Advanced authentication features
  - Sign-up, confirm user email, login with refresh token, two-factor authentication

## Installation

You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the
dependencies by running

```
$ npm i
set your env variables
$ npm run watch
$ npm run dev (for development)
$ npm run prod (for production)
$ npm run debug (for debug)
```

## Acknowledgement

- This project is part of the online course I've taken at Udemy. Thanks to [Jonas Schmedtmann](https://twitter.com/jonasschmedtman) for creating this course.
