const express = require("express");
const app = express();

const tweetnacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');

// Verify the interaction signature
const PUBLIC_KEY = '1fe8e3e4ed23a6426ecdc9bfb16d24714b54460e5fdaf338d507ed2d5b6d181d';
function verifySignature(signature, timestamp, rawBody, publicKey) {
  const message = naclUtil.decodeUTF8(timestamp + rawBody);
  const publicKeyUint8 = naclUtil.decodeBase64(publicKey);
  const signatureUint8 = naclUtil.decodeBase64(signature);

  try {
    return tweetnacl.sign.detached.verify(message, signatureUint8, publicKeyUint8);
  } catch (error) {
    return false;
  }
}

app.post("/interactions", async (req, res) => {

// Your public key can be found on your application in the Developer Portal

const interaction = req.body;

// Verify the interaction's signature
const signature = req.get('X-Signature-Ed25519');
const timestamp = req.get('X-Signature-Timestamp');
const isValidSignature = verifySignature(signature, timestamp, req.rawBody, PUBLIC_KEY);

if (!isValidSignature) {
  return res.status(401).end();
}

switch (interaction.type) {
    case 1: // Ping
      res.json({ type: 1 });
      break;
    case 2: 
    res.status(200).end();
      break;
    default:
      res.status(400).end();
      break;
  }


})

app.listen(5000, () => {
  console.log("Running on port 5000.");
});
// Export the Express API
module.exports = app;