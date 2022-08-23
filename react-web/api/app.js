
"use strict";
require("dotenv").config();

const express = require("express");

const app = express();

app.get('/callback', (req, res) => {
  return res.sendFile('index.html', { root: '.' });
  
})

app.post('/auth/login', (req, res) => {
  const accessToken = req.query.access_token;
  const tokenType = req.query.token_type

  console.log(req.query)

  console.log(accessToken, tokenType);

  res.send({message: 'ok'})
})

//start server locally
// app.listen(8080,function () {
//     console.log("Server started. Go to http://localhost:8080/");
// });


// Export the Express API
module.exports = app;