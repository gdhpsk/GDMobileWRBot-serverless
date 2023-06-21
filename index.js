const express = require("express");
const app = express();
const cors = require("cors")
const nacl = require('tweetnacl');

// Verify the interaction signature
const PUBLIC_KEY = '1fe8e3e4ed23a6426ecdc9bfb16d24714b54460e5fdaf338d507ed2d5b6d181d';
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.post("/interactions", async (req, res) => {

// Your public key can be found on your application in the Developer Portal

const interaction = req.body;

// Verify the interaction's signature
const signature = req.get('X-Signature-Ed25519');
const timestamp = req.get('X-Signature-Timestamp');
  var buf = '';
req.setEncoding('utf8');
req.on('data', function(chunk){ buf += chunk });
req.on('end', function() {
  req.rawBody = buf;
  const isVerified = nacl.sign.detached.verify(
  Buffer.from(timestamp + req.body),
  Buffer.from(signature, 'hex'),
  Buffer.from(PUBLIC_KEY, 'hex')
);
if (!isVerified) {
  return res.status(401).end('invalid request signature');
}
  
});

switch (interaction.type) {
    case 1: // Ping
    res.status(201).send(
        JSON.stringify({
          type: 1
        })
      )
      break;
    case 2: 
    res.status(200).end();
      break;
    default:
      res.status(400).end();
      break;
  }


})

app.listen(process.env.PORT || 5000, () => {
  console.log("Running on port 5000.");
});
// Export the Express API
module.exports = app;