const express = require("express");
const app = express();

app.post("/interactions", (req, res) => {

// Your public key can be found on your application in the Developer Portal
const PUBLIC_KEY = '1fe8e3e4ed23a6426ecdc9bfb16d24714b54460e5fdaf338d507ed2d5b6d181d';

const signature = req.get('X-Signature-Ed25519');
 const timestamp = req.get('X-Signature-Timestamp');
 const isValidRequest = verifyKey(req.rawBody, signature, timestamp, PUBLIC_KEY);
 if (!isValidRequest) {
   return res.status(401).end('Bad request signature');
 }
 let message = req.body
})

app.listen(5000, () => {
  console.log("Running on port 5000.");
});
// Export the Express API
module.exports = app;