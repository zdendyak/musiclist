const appConfig = require('../../config.js');
const crypto = require('crypto');
const express = require('express');
const mailgun = require('mailgun-js')({
  apiKey: appConfig.mailgun.apiKey,
  domain: appConfig.mailgun.domain,
});
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../../models/user.js');

const router = express.Router();

// configure mongoose promises
mongoose.Promise = global.Promise;

// GET to /checksession
router.get('/checksession', (req, res) => {
  if (req.user) {
    return res.send(JSON.stringify(req.user));
  }
  return res.send(JSON.stringify({}));
});

// GET to /logout
router.get('/logout', (req, res) => {
  req.logout();
  return res.send(JSON.stringify(req.user));
});

// POST to /login
router.post('/login', async (req, res) => {
  // look up the user by their email
  const query = User.findOne({ email: req.body.email });
  const foundUser = await query.exec();

  // if they exist, the'll have a username, so add that to our body
  if (foundUser) { req.body.username = foundUser.username; }

  passport.authenticate('local')(req, res, () => {
    // If logged in, we should have user info to send back
    if (req.user) {
      return res.send(JSON.stringify(req.user));
    }

    // Otherwise, return an error
    return res.send(JSON.stringify({ error: 'There was an error logging in' }));
  });
});

// POST to /register
router.post('/register', async (req, res) => {
  // First, check and make sure the email doesn't already exist
  const query = User.findOne({ email: req.body.email });
  const foundUser = await query.exec();
  if (foundUser) { return res.send(JSON.stringify({ error: 'Email or username already exists' })); }

  // Create a user object to save using values from incoming JSON
  if (!foundUser) {
    const newUser = new User(req.body);

    // Save, via Passport's "register" method
    return User.register(newUser, req.body.password, (err) => {
      // If there is a problem, send back a JSON object with the error
      if (err) {
        return res.send(JSON.stringify({ error: err }));
      }
      // Otherwise, log them in
      return passport.authenticate('local')(req, res, () => {
        // If logged in, we should have user info to send back
        if (req.user) {
          return res.send(JSON.stringify(req.user));
        }
        // Otherwise return an error
        return res.send(JSON.stringify({ error: 'There was an error registering the user' }));
      });
    });
  }

  // return an error if all else false
  return res.send(JSON.stringify({ error: 'There was an error registering the user' }));
});

// POST to saveresethash
router.post('/saveresethash', async (req, res) => {
  let result;
  try {
    // check and make sure the email exists
    const query = User.findOne({ email: req.body.email });
    const foundUser = await query.exec();

    // If the user exists, save their password hash
    const timeInMs = Date.now();
    const hashString = `${req.body.email}${timeInMs}`;
    const secret = appConfig.crypto.secret;
    const hash = crypto.createHmac('sha256', secret)
                       .update(hashString)
                       .digest('hex');
    foundUser.passwordReset = hash;

    foundUser.save((err) => {
      if (err) { result = res.json(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' })); }

      // Put together the email
      const emailData = {
        from: `ETS <postmaster@${appConfig.mailgun.domain}>`,
        to: foundUser.email,
        subject: 'Reset Your Password',
        test: `A password reset has been requested for the MusicList account connected to this email adress. If you made this request, please click the following link http://localhost:3000/account/change-password/${foundUser.passwordReset} ... if you didn't make this request, feel free to ignore it!`,
        html: `<p>A password reset has been requested for the MusicList account connected to this email adress. If you made this request, please click the following link <a href="http://localhost:3000/account/change-password/${foundUser.passwordReset}" target="_blank">http://localhost:3000/account/change-password/${foundUser.passwordReset}</a>.</p><p>If you didn't make this request, feel free to ignore it!</p>`,
      };

      // Send it
      mailgun.messages().send(emailData, (error, body) => {
        if (error || !body) {
          result = res.send(JSON.stringify({ error: 'Somathing went wrong when attempting to send the email. Please try again!' }));
        } else {
          result = res.send(JSON.stringify({ success: true }));
        }
      });
    });
  } catch (err) {
    // if user doesn't exist, error out
    result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' }));
  }
  return result;
});

module.exports = router;
