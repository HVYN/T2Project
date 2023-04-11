//  TEST: USE MANAGEMENT API

const express = require('express');
const expressApp = express();

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

//  MIDDLEWARE
const checkJwt = auth({
    audience: 'https://smarties/api',
    issuerBaseURL: `https://dev-fyszmjwlhy8ftgjv.us.auth0.com/`
});

expressApp.get('/api/public', function(req, res) {
    res.json({
        message: 'PUBLIC ENDPOINT TEST.'
    })
});

