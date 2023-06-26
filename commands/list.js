const {levelsSchema, leaderboardSchema} = require("../mongodb")
const country_code = require("../JSON/country_codes.json")
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
              description: 'What level do you want me to display? Can be a placement number / database ID',
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
            } else {
                const emoji = ["Back", "Next", "Skip Forward", "Skip Back", "👎", "👍", "🛑"]
    var act = {
        type: 1,
        components: []
    }
    var act2 = {
        type: 1,
        components: []
    }
    for(let i = 0; i < 4; i++) {
        act.components.push({
            custom_id: i.toString(),
            label: emoji[i],
            type: 2,
            style: 1
        })
    }
    for(let i = 4; i < emoji.length; i++) {
        act2.components.push({
            custom_id: i.toString(),
            label: emoji[i],
            type: 2,
            style: 1
        })
    }
    act.components[0].disabled = true
    let initial = await levelsSchema.find({position: {$gte: 1, $lte: 25}}).sort({position:1})
    let count = await levelsSchema.find().count()
    await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
        body: {
            embeds: [{
                title: "Mobile World Records List Levels",
                description: initial.map(e => {
                    return `[${e.position < 151 ? `#${e.position}. ` : ""}${e.name} by ${e.host} and verified by ${e.verifier}](https://youtube.com/watch?v=${e.ytcode})`
                }).join("\n"),
                footer: {
                    text: `Page 1 / ${Math.ceil(count / 25)}`
                }
            }],
            components: [act, act2]
        }
      })
            }
        }
        if(interaction.data.component_type == 2) {
            let [whyudo, pages] = interaction.message.embeds[0].footer.text.substr(5).split(" / ").map(e => parseInt(e))
            function why(num) {
                if(num == 0) {
                    interaction.message.components[0].components[0].disabled = true
                    interaction.message.components[0].components[1].disabled = false
                } else {
                    if(num == pages-1) {
                        interaction.message.components[0].components[1].disabled = true
                        interaction.message.components[0].components[0].disabled = false
                    } else {
                        interaction.message.components[0].components[1].disabled = false
                        interaction.message.components[0].components[0].disabled = false
                    }
                }
            }
            let initial;
            switch (interaction.data.custom_id) {
                case "0":
                    whyudo--;
                    whyudo = whyudo > 0 ? --whyudo : pages - 1;
                    why(whyudo)
                    initial = await levelsSchema.find({position: {$gte: 1+(whyudo*25), $lte: 25+(whyudo*25)}}).sort({position:1})
                    interaction.message.embeds[0].description = initial.map(e => {
                        return `[${e.position < 151 ? `#${e.position}. ` : ""}${e.name} by ${e.host} and verified by ${e.verifier}](https://youtube.com/watch?v=${e.ytcode})`
                    }).join("\n")
                    interaction.message.embeds[0].footer.text = `Page ${whyudo+1} / ${pages}`
                    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                        body: {
                          type: 7,
                          data: {
                            embeds: interaction.message.embeds,
                            components: interaction.message.components
                          }
                        }
                      })
                    break;
                case "1":
                    whyudo--;
                    whyudo = whyudo + 1 < pages ? ++whyudo : 0;
                    why(whyudo)
                    initial = await levelsSchema.find({position: {$gte: 1+(whyudo*25), $lte: 25+(whyudo*25)}}).sort({position:1})
                    interaction.message.embeds[0].description = initial.map(e => {
                        return `[${e.position < 151 ? `#${e.position}. ` : ""}${e.name} by ${e.host} and verified by ${e.verifier}](https://youtube.com/watch?v=${e.ytcode})`
                    }).join("\n")
                    interaction.message.embeds[0].footer.text = `Page ${whyudo+1} / ${pages}`
                    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                        body: {
                          type: 7,
                          data: {
                            embeds: interaction.message.embeds,
                            components: interaction.message.components
                          }
                        }
                      })
                    break;
                case "2":
                    whyudo = pages-1
                    why(whyudo)
                    initial = await levelsSchema.find({position: {$gte: 1+(whyudo*25), $lte: 25+(whyudo*25)}}).sort({position:1})
                    interaction.message.embeds[0].description = initial.map(e => {
                        return `[${e.position < 151 ? `#${e.position}. ` : ""}${e.name} by ${e.host} and verified by ${e.verifier}](https://youtube.com/watch?v=${e.ytcode})`
                    }).join("\n")
                    interaction.message.embeds[0].footer.text = `Page ${whyudo+1} / ${pages}`
                    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                        body: {
                          type: 7,
                          data: {
                            embeds: interaction.message.embeds,
                            components: interaction.message.components
                          }
                        }
                      })
                    break;
                 case "3":
                    whyudo = 0
                    why(whyudo)
                    initial = await levelsSchema.find({position: {$gte: 1+(whyudo*25), $lte: 25+(whyudo*25)}}).sort({position:1})
                    interaction.message.embeds[0].description = initial.map(e => {
                        return `[${e.position < 151 ? `#${e.position}. ` : ""}${e.name} by ${e.host} and verified by ${e.verifier}](https://youtube.com/watch?v=${e.ytcode})`
                    }).join("\n")
                    interaction.message.embeds[0].footer.text = `Page ${whyudo+1} / ${pages}`
                    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                        body: {
                          type: 7,
                          data: {
                            embeds: interaction.message.embeds,
                            components: interaction.message.components
                          }
                        }
                      })
                    break;
                case "4":
                    var rando = Math.floor(Math.random() * 20)+1
                        var fext = ""
                        if(rando == 10) {
                            fext = `Oh you said the word “Carcano”? Allow me to explain how this incompetent glow-fest of a level is one of the worst and pathetic excuses for an extreme ever. Let’s start off with the deco. The deco is literally just 1.0 but the amount of glow used is wayyyy more than the amount of glow the actors in Twlight had. Did you not see how much they glowed???? Well Carcano glows way more and is the equivalent of stepping on a lego for your eyes. Now let’s talk about the song. You start off with the “tah-taahh-taAAHHHH” which is the dumbest sounding thing I have ever heard in my life and literally sounds squeakier and more annoying than I could ever sound. That’s just the predrop alone. Once you get to the drop, it doesn’t get any better. It has random notes that just feel like dragging on more than the Civil War and it’s so stupid and whoever listened to this and thought “yeah man this is fire” must’ve been braindead enough to hear something else that isn’t this garbage excuse of a song that Creo somehow made. How does the guy behind stuff like, Sphere, Dimension, and Never Make It make THIS pathetic, incompetent, useless piece of “music” that is just dragged out squeaky notes. Let’s talk about perhaps the worst part of the level, the gameplay. The gameplay is trying to make itself like Cognition but turns out the same way costume stores try to replicate movie characters’ costumes. It doesn’t work AT ALL. On top of all of this, every part has a several timings that just ruin the entire part and make it impossible to get consistent at literally any part of this garbage level. The gameplay makes me want to stick my head in the fridge since at least the cool air has better movements and sounds than the level will ever have and looks better. So my conclusion is that Carcano has eye-gouging deco, an ear-piercing song, and gameplay that wants to make an atheist walk to church to pray they don’t have to play this garbage, incompetent excuse of a “level”`
                        } else {
                            fext = "Sunset Sandstorm is unbased af, you gotta click-click-click smh my head"
                        }
                        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                            body: {
                              type: 7,
                              data: {
                                embeds: [
                                   {
                                       description: fext
                                   }
                                ],
                                components: []
                              }
                            }
                          })
                    break;
                case "5":
                    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                        body: {
                          type: 7,
                          data: {
                            embeds: [
                               {
                                   description: "Now you see, Chromatic Haze is hella based, with the sync, the absolutley beautiful wave part, and the super easy ending section"
                               }
                            ],
                            components: []
                          }
                        }
                      })
                    break;
                case "6":
                    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                        body: {
                          type: 7,
                          data: {
                            embeds: interaction.message.embeds,
                            components: interaction.message.components
                          }
                        }
                      })
                    await rest.delete(Routes.channelMessage(interaction.channel.id, interaction.message.id))
                    break;
                default:
                    break;
            }
        }
        if(interaction.data.component_type == 3) {
            await getLevel(interaction.data.values[0], true)
        }
        async function getLevel(name, component) {
            let level;
            try {
                level = await levelsSchema.find({_id: name})
                if(!level.length) throw new Error()
            } catch(_) {
            let levelName = name == "generate" ? {$ne: true} : new RegExp(`^${name.replaceAll("(", "\\(").replaceAll(")", "\\)")}$`, "i")
            let levelPosition = parseInt(name) || ""
            let aggregation = [
                {$match: {$or: [{name: levelName}, {position: levelPosition}]}}
            ]
            if(name == "generate") {
                aggregation.push({$sample: {$size:1}})
            }
            level = await levelsSchema.aggregate(aggregation)
        }
            if(!level?.length) {
                let imgdata = await fs.readFile("./assets/level_not_found.png")
                                var em = {
                                    title: `${name.slice(0, 20)}${name.length > 20 ? "..." : ""} by ${interaction.member.user.username} and verified by Nontypical`,
                                    color: random_hex_color_code(),
                                    url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
                                    image:  {url: `attachment://404.png`},
                                    description:  `Unfortunately, our server could not find the level you were looking for <:sadsphere:839693880370528256>. Please try again.`,
                                    author: {name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024`}
                                }
                                let data = {
                                    embeds: [em]
                                }
                                await rest[component ? "post" : "patch"](component ? Routes.interactionCallback(interaction.id, interaction.token) : Routes.webhookMessage(interaction.application_id, interaction.token), {
                                    body: component ? {
                                        type: 7,
                                        data
                                    } : data,
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
            if(level.length > 1) {
                components.push({
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "levels",
                            placeholder: `Choose a level to display:`,
                            options: await Promise.all(level.map(async e => {
                                return {
                                    label: `#${e.position} - ${e.name} by ${e.host}`,
                                    description: `Verified by ${e.verifier}`,
                                    value: e._id.toString()                          
                                }
                            }))
                        }
                    ]
                })
        }

        if(components.length) {
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    components
                }
              })
              return;
        } else {
            level = level[0]
        }

        if(level) {
            let embed = {
                title: `${level.position > 150 ? "" : `#${level.position} - `}${level.name} by ${level.host} and verified by ${level.verifier}`,
                color: random_hex_color_code(),
                url: `https://www.youtube.com/watch?v=${level.ytcode}`,
                image: {url: `https://i.ytimg.com/vi/${level.ytcode.split("?v=")[0]}/mqdefault.jpg`},
                description: level.list.map(e => {
                    if(e.name == "") return "No one has a world record on this level."
                    return `${e.name} ${e.verification ? "verified" : `got [${e.percent[0]}% ${e.percent[1] ? `(${e.percent[1]}% with screenshot) on` : "on"}`} ${level.name}](${e.link}) on ${e.hertz}hz. This record${level.position < 76 && e.listpercent ? " is list% and" : " is not list% and"} ${e.screenshot ? "is a screenshot" : "is not a screenshot"}. ${e.deleted ? "(deleted)" : ""}`
                }).join("\n\n"),
                author: {name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,  icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024`},
                footer: name == 'generate' ? {text: "This level was generated!"} : ""
            }
            let data = {
                embeds: [embed],
                components: []
            }
            await rest[component ? "post" : "patch"](component ? Routes.interactionCallback(interaction.id, interaction.token) : Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: component ? {
                    type: 7,
                    data
                } : data
              })
        }
        }
  }
}
    