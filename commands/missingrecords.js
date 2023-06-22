let {levelsSchema} = require("../mongodb")
module.exports = {
    data: {
      "name": "missingrecords",
      "type": 1,
      "description": "Levels that are missing records on the MWR List",
      options: [
        {
            type: 5,
            name: "includescreeshot",
            description: "Should screenshots be included?",
            required: true
        }
      ]
  },
  async execute(interaction, rest, Routes) {
    console.log(interaction)
    let screenshotonly = interaction.data.options[0].value
        let txt = []
    if(screenshotonly) {
        let everything = await levelsSchema.find({"list.name": ""});
        for(let i = 0; i < everything.length; i++) {
            txt.push({pos: everything[i].position, text: `[#${everything[i].position}: ${everything[i].name} by ${everything[i].host} and verified by ${everything[i].verifier}.](https://youtube.com/watch?v=${everything[i].ytcode})\n`})
        }
    } else {
        let everything2 = await levelsSchema.find({"list.screenshot": {$ne: true}});
        let everything = []
        for(let i = 0; i < everything2.length; i++) {
                everything.push(everything2[i])
        }
        for(let i = 0; i < everything.length; i++) {
            txt.push({pos: everything[i].position, text: `[#${everything[i].position}: ${everything[i].name} by ${everything[i].host} and verified by ${everything[i].verifier}.](https://youtube.com/watch?v=${everything[i].ytcode})\n`})
        }
        everything = await levelsSchema.find({"list.name": "", "list.screenshot": false});
        for(let i = 0; i < everything.length; i++) {
            txt.push({pos: everything[i].position, text: `[#${everything[i].position}: ${everything[i].name} by ${everything[i].host} and verified by ${everything[i].verifier}.](https://youtube.com/watch?v=${everything[i].ytcode})\n`})
        }
    }
    txt?.sort((a, b) => a.pos - b.pos)
    let embeds = []
    let page = 10
    let size = Math.ceil(txt.length/page)
    for(let i = 0; i < size; i++) {
        let text = ""
        for(let j = i*page; j < (i+1)*page; j++) {
            if(!txt[j]) break;
          text += txt[j].text
        }
        embeds.push({
            title: "Mobile World Records List Missing Levels",
            description: text,
            footer: {
                text: i
            }
        })
    }
    if(embeds.length == 0) {
        embeds.push({
            title: "Mobile World Records List Missing Levels",
            description: `There are no more missing records of type ${screenshotonly ? "screenshot/video" : "video"} left. Nice work!`
        })
    }
    let buttons;
    if(size > 1) {
        buttons = {
            type: 1,
            components: []
        }
        buttons.components.push(
            {
                    type: 2,
                    style: 1,
                    custom_id: "next",
                    label: "Next"
            },
            {
                type: 2,
                style: 1,
                custom_id: "back",
                label: "Back"
            }
        )
        buttons = [buttons]
    } else {
        buttons = []
    }

if(interaction.data.component_type == 1) {
    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
    body: {
      type: 4,
      data: {
        embeds: [embeds[0]],
        components: buttons
      }
    }
  })
}
    if(interaction.data.component_type == 2) {
        let whyudo = parseInt(interaction.data.embeds[0].footer.text)
        switch (interaction.data.custom_id) {
            case "back":
                whyudo = whyudo > 0 ? --whyudo : embeds.length - 1;
                await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                body: {
                  type: 7,
                  data: {
                    embeds: [embeds[whyudo]],
                    components: buttons
                  }
                }
              })
                break;
            case "next":
                whyudo = whyudo + 1 < embeds.length ? ++whyudo : 0;
                 await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                    body: {
                      type: 7,
                      data: {
                        embeds: [embeds[whyudo]],
                        components: buttons
                      }
                    }
                  })
                break;
            default:
                break;
        }
    }
}
    }