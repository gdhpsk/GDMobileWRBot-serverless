let levelsSchema = require("../schemas/levels")

module.exports = {
    data: {
        name: "editlevel",
        description: "This is the editlevel command.",
        type: 1,
        dm_permission: false,
        default_member_permissions: 8,
        options: [
            {
                type: 3,
                name: "level",
                description: "The level's Object ID",
                required: true
            },
            {
                type: 4,
                name: "position",
                description: "The edited position",
                required: false
            },
            {
                type: 3,
                name: "name",
                description: "The edited name",
                required: false
            },
            {
                type: 3,
                name: "host",
                description: "The edited host",
                required: false
            },
            {
                type: 3,
                name: "verifier",
                description: "The edited verifier",
                required: false
            },
            {
                type: 3,
                name: "ytcode",
                description: "The edited ytcode",
                required: false
            },
            {
                type: 5,
                name: "unrated",
                description: "The edited unrated status",
                required: false
            },
            {
                type: 3,
                name: "levelid",
                description: "The edited levelID",
                required: false
            },
            {
                type: 3,
                name: "thumbnail_type",
                description: "The edited thumbnail type",
                required: false,
                choices: [
                    {
                        name: "YouTube",
                        value: "youtube"
                    }
                ]
            },
            {
                type: 3,
                name: "thumbnail_code",
                description: "The edited thumbnail code",
                required: false
            },
            {
                type: 3,
                name: "move150below",
                description: "Move #150 level below? Object ID",
                required: false
            },
            {
                type: 3,
                name: "new150",
                description: "New #150 level? Object ID",
                required: false
            }
          ]
    },
    async execute(interaction, rest, Routes) {
        let getOption = (option) => interaction.data?.options?.find(e => e.name == option)?.value
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
            body: {
              type: 5
            }
          })
        try {
            let level = await levelsSchema.findById(getOption("level"))
            if(!level) throw new Error()
        } catch(_) {
    console.log(_)
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    content: "Could not find the specified level ID!"
                }
              })
              return
        }
        let original = await levelsSchema.findById(getOption("level"))
        let obj = {
            original,
            changes: {
                position: getOption("position"),
                name: getOption("name"),
                host: getOption("host"),
                verifier: getOption("verifier"),
                ytcode: getOption("ytcode"),
                unrated: getOption("unrated"),
                levelID: getOption("levelid"),
                thumbnail: getOption("thumbnail_type") && getOption("thumbnail_code") ? {
                    type: getOption("thumbnail_type"),
                    value: getOption("thumbnail_code")
                } : undefined
            },
            move150below: getOption("move150below"),
            new150: getOption("new150")
        }
        try {
            let req = await fetch("https://gdmobilewrlist.com/api/levels/edit", {
            method: "PATCH",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({
                token: process.env.API_TOKEN,
                ...obj
            })
        })
        if(req.ok) throw new Error()
        let err = await req.json()
        await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
            body: {
                content: err.message
            }
          })
          return
        } catch(_) {
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    content: "Success!"
                }
              })
              return
        }
    }
}