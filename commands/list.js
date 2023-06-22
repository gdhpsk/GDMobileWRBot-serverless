const {levelsSchema, leaderboardSchema} = require("../mongodb")
const country_code = require("../JSON/country_codes.json")
let {set} = require("../JSON/serverstuff.json")
const fs = require("fs/promises")
const lowercaseKeys = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {});

  const random_hex_color_code = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return parseInt("0x" + n.slice(0, 6))
  };

  let cache = new Map()

module.exports = {
    data: {
      "name": "list",
      "type": 1,
      "description": "This is the list command.",
      options: [
          {
              type: 3,
              name: "level",
              description: 'What level do you want me to display? Can be a placement number',
              required: false
          }
      ],
  },
  cooldown: require("../cooldowns.json").list,
  async execute(interaction, rest, Routes, events) {
    if(interaction.data.type == 1) {
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
            body: {
              type: 5
            }
          })
        }
        async function getLevel(name) {
            let levelName = name == "generate" ? {$ne: true} : new RegExp(`^${name}$`, "i")
            let levelPosition = parseInt(name) || ""
            let level = (await levelsSchema.aggregate([
                {$match: {$or: [{name: levelName}, {position: levelPosition}]}},
                {$sample: {size: 1}},
                {$limit: 1}
            ]))[0]
            let duplicates = set.find(e => e.name == name.toLowerCase())
            if(!level && !duplicates) {
                let imgdata = await fs.readFile("./assets/level_not_found.png")
                                var em = {
                                    title: `${name.slice(0, 20)}${name.length > 20 ? "..." : ""} by ${interaction.member.user.username} and verified by Nontypical`,
                                    color: random_hex_color_code(),
                                    url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
                                    image:  {url: `attachment://404.png`},
                                    description:  `Unfortunately, our server could not find the level you were looking for <:sadsphere:839693880370528256>. Please try again.`,
                                    author: {name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024`}
                                }
                                await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                                    body: {
                                        embeds: [em]
                                    },
                                    files: [
                                        {
                                            name: "404.png",
                                            data: imgdata
                                        }
                                    ]
                                  })
                                  return
            }
            let components = {
                type: 1,
                components: [
                    {
                        type: 3,
                        custom_id: "levels",
                        options: duplicates["function replacements"].map(async e => {
                            let d = await levelsSchema.findOne({name: e.actual})
                            return {
                                label: `#${d.position} - ${e.name} by ${d.host}`,
                                description: `Verified by ${d.verifier}`,
                                default: duplicates["function replacements"].indexOf(e) ? false : true,
                                value: d.name                          
                            }
                        })
                    }
                ]
            }
            console.log(components)
        }
  }
}
    