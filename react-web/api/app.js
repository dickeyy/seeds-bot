
"use strict";
require("dotenv").config();

const express = require("express");

const app = express();

app.get('/api/app', (req, res) => {
  res.send({message: 'ok'})
  
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