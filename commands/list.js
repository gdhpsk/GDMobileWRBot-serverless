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
    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
        body: {
          type: 5
        }
      })
    var alldata = await levelsSchema.find()
    alldata.sort((a, b) => a.position - b.position)
    var alldatalead = await leaderboardSchema.find()
    var rawdata = alldata.reduce(function(acc, cur, i) {
            acc[alldata[i].name] = cur;
              return acc;
            }, {});
            let lea = alldatalead.reduce(function(acc, cur, i) {
                acc[alldatalead[i].name] = cur;
                  return acc;
                }, {})
    var ok = interaction.data?.options?.find(e => e.name == "level")?.value
    if(ok != null || ok != undefined) {
        ok = interaction.data?.options?.find(e => e.name == "level")?.value.toLowerCase()
    }
    const embed = {}
    const but = {
        type: 1,
        components: [
            {
                type: 2,
                custom_id: "true",
                style: 1
            },
            {
                type: 2,
                custom_id: "false",
                style: 1
            }
        ]
    }
    
    
    let gay = 0
    let num = ""
    let generated = false
    var big1 = Math.floor(Math.random() * 255);
    var big2 = Math.floor(Math.random() * 255);
    var big3 = Math.floor(Math.random() * 255);
async function important(pjgf) {
        let level = Object.values(rawdata)[gay]
                    let txt = []
                    for(let i = 0; i < level.list.length; i++) {
                        let text = ['got', '', ` ${level.list[i].percent[0]}% on`, 'not a screenshot.', 'not list% and is ', '', '']
                       
                            
                        if(lowercaseKeys(lea)[level.list[i].name.toLowerCase()]) {
                            if(lowercaseKeys(lea)[level.list[i].name.toLowerCase()].nationality) {
                                text[5] = `:flag_${lowercaseKeys(country_code)[lowercaseKeys(lea)[level.list[i].name.toLowerCase()].nationality.toLowerCase()]}: `
                            }
                        }
                    
                        // removing the record text if verification
                        if(level.list[i].verification) {
                            text[0] = "verified"
                        }
                        // if theres another clip/screenshot record
                        if(level.list[i].percent[1] != "") {
                            text[1] =  ` (${level.list[i].percent[1]}% with screenshot) on`
                        } else if(level.list[i].percent[1] != "" && !level.list[i].verification) {
                            text[1] = ` on`
                        }
                        // verification text
                        if(level.list[i].verification) {
                            text[2] = ""
                        }
                     // seeing if it's a screenshot 
                        if(level.list[i].screenshot == true) {
                            text[3] =  "a screenshot."
                        }
                        // seeing if the record is list%
                        if(level.list[i].listpercent == true && gay <= 150) {
                               text[4] = "list% and is "
                        } else if(level.list[i].percent[0] == "100" && gay <= 150) {
                                text[4] = "list% and is "
                        } else if(gay > 150) {
                            text[4] = ""
                        }
                        if(level.list[i].deleted) {
                            text[6] = " (deleted)"
                        }
                        // object showing all of the above
                        let object = {
                            verification: text[0],
                            percent: text[2],
                            secondpercent: text[1],
                            verifiertext: text[2],
                            screenshot: text[3],
                            listpercent: text[4],
                            nationality: text[5],
                            marked: text[6]
                        }
                        txt.push(object)
                    }
                    let recordList = ''
                    for(let j = 0; j < level.list.length; j++) {
                        if(level.list[0].name == '') {
                            recordList = 'No one has a world record on this level.'
                        } else {
                            recordList += `-${txt[j].marked} ${txt[j].nationality}${level.list[j].name} ${txt[j].verification}[${txt[j].percent}${txt[j].secondpercent} ${level.name}](${level.list[j].link}) on ${level.list[j].hertz}hz. This record is ${txt[j].listpercent}${txt[j].screenshot}\n\n`
                        }
                    }
                    if(gay > 149) {
                        num = ""
                    } else {
                        num = `#${gay + 1} - `
                    }
                                                 
                    embed.title = `${num}${level.name} by ${level.host} and verified by ${level.verifier}`
                    embed.color = random_hex_color_code()
                    embed.url = `https://www.youtube.com/watch?v=${level.ytcode}`
                    embed.image = {url: `https://i.ytimg.com/vi/${level.ytcode.split("?v=")[0]}/mqdefault.jpg`}
                    embed.description = `${recordList}` 
                    embed.author = {name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,  icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024`}
                    if(generated) {
                        embed.footer = {text: "This level was generated!"}
                    }
                    let k;
                    if(pjgf === undefined  || pjgf == "LMFAOA") {
                        k = {embeds: [embed]}
                    } else {
                            k = pjgf
                    }             
                    if(pjgf == "LMFAOA") {
                        await rest.post(Routes.webhook(interaction.application_id, interaction.token), {
                            body: k
                          })
                    } else {            
                        await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                            body: k
                          })
                        }
                    }
                    
                    
    let amount = parseInt(interaction.data?.options?.find(e => e.name == "level")?.value); 
    var IK = Object.values(rawdata).length-1
    var lolxd = Object.values(rawdata)

function gh(val) {
if(val != undefined) {
return Object.values(rawdata)[Object.keys(rawdata).indexOf(`${val.actual}`)].host
}
}
    let jajajaja = require("../JSON/serverstuff.json").set
    let LL = []
   async function JJJ(name1, name2, name3, name4, name5) {
        var a, b, c, d, e

        a = name1.name
        b = name2.name
        but.components[0].label = `${a} by ${gh(name1)}`
        but.components[1].label = `${b} by ${gh(name2)}`
        if(name3) {
            c = name3.name
            but.components.push({
                type: 1,
                custom_id: "middle",
                style: 1,
                label: `${c} by ${gh(name3)}`
            })
        }
        if(name4) {
            d = name4.name
            but.components.push({
                type: 1,
                custom_id: "bro",
                style: 1,
                label: `${d} by ${gh(name4)}`
            })
        }
        if(name5) {
            e = name5.name
            but.components.push({
                type: 1,
                custom_id: "chill",
                style: 1,
                label: `${e} by ${gh(name5)}`
            })
        }
        await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
            body: {
                content: `Which ${name1.name}?`, 
              components: [but]
            }
          })
        events.on("INTERACTION_CREATE", async(buttonclick) => {
            if(buttonclick.data?.component_type != 2 || buttonclick.message?.interaction?.id != interaction.id) return;
            if(buttonclick.data.custom_id == "true") {
                gay = Object.keys(rawdata).indexOf(`${name1.actual}`)
                await rest.delete(Routes.webhookMessage(interaction.application_id, interaction.token))
                important("LMFAOA")
            } else if(buttonclick.data.custom_id == "false") {
                gay = Object.keys(rawdata).indexOf(`${name2.actual}`)
                await rest.delete(Routes.webhookMessage(interaction.application_id, interaction.token))
                important("LMFAOA")
            }else if(buttonclick.data.custom_id == "middle") {
                gay = Object.keys(rawdata).indexOf(`${name3.actual}`)
                await rest.delete(Routes.webhookMessage(interaction.application_id, interaction.token))
                important("LMFAOA")
            }else if(buttonclick.data.custom_id == "bro") {
                gay = Object.keys(rawdata).indexOf(`${name4.actual}`)
                await rest.delete(Routes.webhookMessage(interaction.application_id, interaction.token))
                important("LMFAOA")
            }else if(buttonclick.data.custom_id == "chill") {
                gay = Object.keys(rawdata).indexOf(`${name5.actual}`)
                await rest.delete(Routes.webhookMessage(interaction.application_id, interaction.token))
                important("LMFAOA")
            }
        }) 
}
for(let j = 0; j < jajajaja.length; j++) {
LL.push(jajajaja[j].name)
}
            if(interaction.data?.options?.find(e => e.name == "level")?.value) {
                if(interaction.data?.options?.find(e => e.name == "level")?.value == "generate"){
                        amount = Math.floor(Math.random() * IK)
                        gay = amount
                        generated = true
                        important()  
                        if(!interaction.guild_id && Object.keys(rawdata)[amount].toLowerCase() == "distraught") {
                            var mat = await require("../schemas/distraught").findById("620d82791a3d44d419816c42")
                            interaction.guild.members.cache.get(mat.personID).roles.remove("931432673702994012")
                            interaction.member.roles.add("931432673702994012")
                            await require("../schemas/distraught").findByIdAndUpdate("620d82791a3d44d419816c42", {personID: message.author.id})
                        }
                } else if(isNaN(ok) && interaction.data?.options?.find(e => e.name == "level")?.value != "generate") {
                    if(LL.includes(ok)) {
                        for(let i = 0; i < jajajaja.length; i++) {
                        if(ok == jajajaja[i].name) {
                        if(jajajaja[i]["function replacements"].length == 2) {
                        JJJ(jajajaja[i]['function replacements'][0], jajajaja[i]['function replacements'][1])
                        break;
                        } else if(jajajaja[i]["function replacements"].length == 3) {
                            JJJ(jajajaja[i]['function replacements'][0], jajajaja[i]['function replacements'][1], jajajaja[i]['function replacements'][2])
                            break;
                            } else if(jajajaja[i]["function replacements"].length == 4) {
                                JJJ(jajajaja[i]['function replacements'][0], jajajaja[i]['function replacements'][1], jajajaja[i]['function replacements'][2], jajajaja[i]['function replacements'][3])
                                break;
                                } else if(jajajaja[i]["function replacements"].length == 5) {
                                    JJJ(jajajaja[i]['function replacements'][0], jajajaja[i]['function replacements'][1], jajajaja[i]['function replacements'][2], jajajaja[i]['function replacements'][3], jajajaja[i]['function replacements'][4])
                                    break;
                                    }
                                }
                    }
                    } else {
                    for (var i = 0; i < IK+1; i++) {
                        if(lolxd[i].name.toLowerCase() == ok) {
                            gay = i
                            important()
                            break;
                        } else if(lolxd[i].name.toLowerCase() != ok) { 
                            if(i != IK) {
                                continue;
                            } else {

                                let imgdata = await fs.readFile("./assets/level_not_found.png")
                                var em = {}
                                var fk = ok
                                if(ok.length > 20) {
                                    fk = `${ok.slice(0, 20)}...`
                                }

                                em.title = `${fk} by ${interaction.member.user.username} and verified by Nontypical`
                                 em.color = random_hex_color_code()
                                em.url = `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
                                em.image  = {url: `attachment://404.png`}
                                em.description = `Unfortunately, our server could not find the level you were looking for <:sadsphere:839693880370528256>. Please try again.` 
                                em.author = {name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024`}
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
                                break;
                            }
                        }
                }
            }
                }else if((amount < 1 || amount > 150) && !rawdata[ok]) {
                    await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                        body: {
                            content: "Input any number between 1 and 150!"
                          }
                      })
                    
                }else if((amount >= 1 || amount <= 150) && !rawdata[ok]) {
                    gay = amount - 1
                    important()
                }
                } else if(!interaction.data?.options?.find(e => e.name == "level")?.value) {
                    let hy = []
                    let page = 25
                    let fr = ""
                    for(let i = 0; i < Math.floor(Object.keys(rawdata).length / page); i++) {
                        var addition = 0
                        if(!Number.isInteger(Object.keys(rawdata).length / page)) {
                            addition = 1
                        }
                        let txt = ""
                        let number = page * i
                        for(let j = number; j < (number + page); j++) {
                            let smt = [`${j+1}. `]
                            if(j > 149) {
                                smt[0] = ""
                            }
                            txt += `[${smt[0]}${Object.values(rawdata)[j].name} by ${Object.values(rawdata)[j].host} and verified by ${Object.values(rawdata)[j].verifier}](https://www.youtube.com/watch?v=${Object.values(rawdata)[j].ytcode})\n`
                        }
                        hy.push({
                            title: "Mobile World Records List Levels",
                            description: txt,
                            footer: {text: `Page ${i+1} / ${Math.floor(Object.keys(rawdata).length / page) + addition}`}
                        })
                    }
                    if((hy.length * page) != Object.keys(rawdata).length) {
                        for(let j = (hy.length * page); j < Object.keys(rawdata).length; j++) {
                            fr += `[${Object.values(rawdata)[j].name} by ${Object.values(rawdata)[j].host} and verified by ${Object.values(rawdata)[j].verifier}](https://www.youtube.com/watch?v=${Object.values(rawdata)[j].ytcode})\n`
                        }
                        hy.push({
                            title: "Mobile World Records List Levels",
                            description: fr,
                            footer: {text: `Page ${Math.floor(Object.keys(rawdata).length / page) + 1} / ${Math.floor(Object.keys(rawdata).length / page) + 1}`}
                        })
                    }
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
    await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
        body: {
            embeds: [hy[0]],
            components: [act, act2]
        }
      })
    var whyudo = 0
    function why(num) {
        if(num == 0) {
            act.components[0].disabled = true
            act.components[1].disabled = false
        } else {
            if(num == hy.length-1) {
                act.components[1].disabled = true
                act.components[0].disabled = false
            } else {
                act.components[1].disabled = false
                act.components[0].disabled = false
            }
        }
    }
    events.on("INTERACTION_CREATE", async(buttonclick) => {
        if(buttonclick.data?.component_type != 2 || buttonclick.message?.interaction?.id != interaction.id) return;
        switch (buttonclick.data.custom_id) {
            case "0":
                whyudo = whyudo > 0 ? --whyudo : hy.length - 1;
                why(whyudo)
                await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                    body: {
                      type: 7,
                      data: {
                        embeds: [
                            hy[whyudo]
                        ],
                        components: [act, act2]
                      }
                    }
                  })
                break;
            case "1":
                whyudo = whyudo + 1 < hy.length ? ++whyudo : 0;
                why(whyudo)
                await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                    body: {
                      type: 7,
                      data: {
                        embeds: [
                            hy[whyudo]
                        ],
                        components: [act, act2]
                      }
                    }
                  })
                break;
            case "2":
                whyudo = hy.length-1
                why(whyudo)
                await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                    body: {
                      type: 7,
                      data: {
                        embeds: [
                            hy[whyudo]
                        ],
                        components: [act, act2]
                      }
                    }
                  })
                break;
             case "3":
                whyudo = 0
                why(whyudo)
                await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                    body: {
                      type: 7,
                      data: {
                        embeds: [
                            hy[whyudo]
                        ],
                        components: [act, act2]
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
                    await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
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
                await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
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
                await rest.delete(Routes.webhookMessage(interaction.application_id, interaction.token))
                break;
            default:
                break;
        }
    })
                }
            }
}
    