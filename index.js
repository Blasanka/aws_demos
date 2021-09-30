const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  region: 'ap-southeast-1',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY
})
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/signed-url', async (req, res) => {
  await s3.createPresignedPost({
    Fields: {
      key: uuidv4(),
    },
    Conditions: [
      ["starts-with", "$Content-Type", "image/"],
      ["content-length-range", 0, 1000000],
    ],
    Expires: 30,
    Bucket: 'exdev-contents',
  }, (err, signed) => {
      console.log(signed);
      res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    return res.json(signed);
  });
})

app.listen(8081);