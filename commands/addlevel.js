let levelsSchema = require("../schemas/levels")

module.exports = {
    data: {
        name: "addlevel",
        description: "This is the addlevel command.",
        type: 1,
        dm_permission: false,
        default_member_permissions: 8,
        options: [
            {
                type: 4,
                name: "position",
                description: "The edited position",
                required: true
            },
            {
                type: 3,
                name: "name",
                description: "The edited name",
                required: true
            },
            {
                type: 3,
                name: "host",
                description: "The edited host",
                required: true
            },
            {
                type: 3,
                name: "verifier",
                description: "The edited verifier",
                required: true
            },
            {
                type: 3,
                name: "ytcode",
                description: "The edited ytcode",
                required: true
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
        let obj = {
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
        }
        try {
            let req = await fetch("https://gdmobilewrlist.com/api/levels/add", {
            method: "POST",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({
                token: process.env.API_TOKEN,
                level: obj,
                move150below: getOption("move150below")
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