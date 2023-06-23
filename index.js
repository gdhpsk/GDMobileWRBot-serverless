const express = require("express");
const app = express();
const cors = require("cors")
const nacl = require('tweetnacl');
const dotenv = require("dotenv")
const fs = require("fs")
if(!process.env.token) {
    dotenv.config()
}

const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v10");
const { default: mongoose } = require("mongoose");
const { levelsSchema } = require("./mongodb");
let rest = new REST({version: "10"}).setToken(process.env.token)

// Verify the interaction signature
const PUBLIC_KEY =process.env.public_key;
const CLIENT_ID = process.env.app_id;
function verifySignature(signature, timestamp, rawBody, publicKey) {

const isVerified = nacl.sign.detached.verify(
  Buffer.from(timestamp + rawBody),
  Buffer.from(signature, 'hex'),
  Buffer.from(publicKey, 'hex')
);
    return isVerified
  }

function rawBodySaver(req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }

  let commands = fs.readdirSync("./commands").filter(e => e.endsWith(".js"));
let cmdobject = {}
for(const file of commands) {
  let command_file = require(`./commands/${file}`)
  cmdobject[command_file.data.name] = command_file
};

app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.post("/interactions", express.json({verify: rawBodySaver}), async (req, res) => {

// Your public key can be found on your application in the Developer Portal

const interaction = req.body;

// Verify the interaction's signature
const signature = req.get('X-Signature-Ed25519');
const timestamp = req.get('X-Signature-Timestamp');
const isValidSignature = verifySignature(signature, timestamp, req.rawBody, PUBLIC_KEY);
if (!isValidSignature) {
  return res.status(401).end('invalid request signature');
}

switch (interaction.type) {
    case 1: // Ping
      res.json({ type: 1 });
      break;
    default: 
    mongoose.connect(process.env.MONGODB_URI);
    req.body.member = {
        user: req.body.member?.user ?? req.body.user
    }
    let exec = cmdobject[req.body.data.name ?? req.body.message.interaction.name].execute(req.body, rest, Routes)
    res.status(200).send(exec);
      break;
  }


});

app.listen(process.env.PORT || 5000, async () => {
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: Object.values(cmdobject).map(e => e.data)
    })
      console.log("Registered slash commands.");
});
// Export the Express API
module.exports = app;