let levelsSchema = require("../schemas/levels")

module.exports = {
    data: {
        name: "deletelevel",
        description: "This is the delete command.",
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
                type: 3,
                name: "new150",
                description: "New 150 level's Object ID",
                required: true
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
            level: original,
            new150: getOption("new150")
        }
        try {
            let req = await fetch("https://gdmobilewrlist.com/api/levels/delete", {
            method: "DELETE",
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