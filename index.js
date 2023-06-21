const express = require("express");
const app = express();

app.post("/interactions", (req, res) => {
    const nacl = require('tweetnacl');

// Your public key can be found on your application in the Developer Portal
const PUBLIC_KEY = '1fe8e3e4ed23a6426ecdc9bfb16d24714b54460e5fdaf338d507ed2d5b6d181d';

const signature = req.get('X-Signature-Ed25519');
const timestamp = req.get('X-Signature-Timestamp');
const body = req.rawBody; // rawBody is expected to be a string, not raw bytes

const isVerified = nacl.sign.detached.verify(
  Buffer.from(timestamp + body),
  Buffer.from(signature, 'hex'),
  Buffer.from(PUBLIC_KEY, 'hex')
);

if (!isVerified) {
  return res.status(401).end('invalid request signature');
}

if(req.body.type == 1) {
    res.status(200).send(
        JSON.stringify({
          type: 1
        })
      )
}
})

app.listen(5000, () => {
  console.log("Running on port 5000.");
});
// Export the Express API
module.exports = app;