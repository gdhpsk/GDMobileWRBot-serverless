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
  async execute(interaction, rest, Routes) {
    let level = interaction.data?.options?.find(e => e.name == "level")?.value
    if(interaction.data.type == 1) {
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
            body: {
              type: 5
            }
          })
          if(level) {
                await getLevel(level)
            }
        }
        if(interaction.data.component_type == 3) {
            await getLevel(interaction.data.value)
        }
        async function getLevel(name) {
            let levelName = name == "generate" ? {$ne: true} : new RegExp(`^${name}$`, "i")
            let levelPosition = parseInt(name) > 150 ? "" : parseInt(name)
            let aggregation = [
                {$match: {$or: [{name: levelName}, {position: levelPosition}]}}
            ]
            if(name == "generate") {
                aggregation.push({$sample: {$size:1}})
            }
            let level = await levelsSchema.aggregate(aggregation)
            let duplicates = set.find(e => e.name == name.toLowerCase())
            if(!level?.length && !duplicates) {
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
            let components = []
            if(duplicates) {
                level = await levelsSchema.findOne({name: duplicates["function replacements"][0].actual})
            components.push({
                type: 1,
                components: [
                    {
                        type: 3,
                        custom_id: "levels",
                        options: await Promise.all(duplicates["function replacements"].map(async e => {
                            let d = await levelsSchema.findOne({name: e.actual})
                            return {
                                label: `#${d.position} - ${e.name} by ${d.host}`,
                                description: `Verified by ${d.verifier}`,
                                default: duplicates["function replacements"].indexOf(e) ? false : true,
                                value: d.name                          
                            }
                        }))
                    }
                ]
            })
        } else {
            level = level[0]
            if(level.length > 1) {
                components.push({
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "levels",
                            options: await Promise.all(level.map(async e => {
                                return {
                                    label: `#${e.position} - ${e.name} by ${e.host}`,
                                    description: `Verified by ${e.verifier}`,
                                    default: level.indexOf(e) ? false : true,
                                    value: e.name                          
                                }
                            }))
                        }
                    ]
                })
            } 
        }

        if(level) {
            let embed = {
                title: `${level.position > 150 ? "" : `#${level.position} - `}${level.name} by ${level.host} and verified by ${level.verifier}`,
                color: random_hex_color_code(),
                url: `https://www.youtube.com/watch?v=${level.ytcode}`,
                image: {url: `https://i.ytimg.com/vi/${level.ytcode.split("?v=")[0]}/mqdefault.jpg`},
                description: level.list.map(e => {
                    return `${e.name} ${e.verification ? "verified" : `got ${e.percent[0]}% ${e.percent[1] ? `(${e.percent[1]}% with screenshot) on` : "on"}`} ${level.name} on ${e.hertz}hz. This record${level.position < 76 && e.listpercent ? " is list% and" : ""} ${e.screenshot ? "is a screenshot" : "is not a screenshot"}. ${e.deleted ? "(deleted)" : ""}`
                }).join("\n\n"),
                author: {name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,  icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024`},
                footer: name == 'generate' ? {text: "This level was generated!"} : ""
            }
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    embeds: [embed],
                    components
                }
              })
        }

        }
  }
}
    