let leaderboardSchema = require("../schemas/leaderboard")

module.exports = {
    data: {
        name: "deleteplayer",
        description: "This is the deleteplayer command.",
        type: 1,
        dm_permission: false,
        default_member_permissions: 8,
        options: [
            {
                type: 3,
                name: "player",
                description: "The player's name",
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
            let profile = await leaderboardSchema.findOne({$expr: {$eq: [{$toLower: "$name"}, getOption("player").toLowerCase()]}})
            if(!profile) throw new Error()
        } catch(_) {
    console.log(_)
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    content: "Could not find the specified player!"
                }
              })
              return
        }
        let profile = await leaderboardSchema.findOne({$expr: {$eq: [{$toLower: "$name"}, getOption("player").toLowerCase()]}})
        let obj = {
            profile
        }
        try {
            let req = await fetch("https://gdmobilewrlist.com/api/leaderboard/delete", {
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