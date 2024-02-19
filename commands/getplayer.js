let leaderboardSchema = require("../schemas/leaderboard")

module.exports = {
    data: {
        name: "getplayer",
        description: "This is the getplayer command.",
        type: 1,
        dm_permission: false,
        default_member_permissions: 8,
        options: [
            {
                type: 3,
                name: "name",
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
            let profile = await leaderboardSchema.findOne({$expr: {$eq: [{$toLower: "$name"}, getOption("name")]}})
            if(!profile) throw new Error()
        } catch(_) {
    console.log(_)
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    content: "Could not find the specified level ID!"
                }
              })
              return
        }
        let original = await leaderboardSchema.findOne({$expr: {$eq: [{$toLower: "$name"}, getOption("name")]}}).lean()
        let message = ""
        Object.entries(original).filter(e => !Array.isArray(e[1]) && e[0] != 'socials').forEach(e => {
            if(e[0] == "socials") {
                message += "socials:"
                Object.entries(e[1][0]).forEach(e => {
                    message += `\n${e[0]}: ${e[1]}`
                })
            }
            message += `${e[0]}: ${e[1]}\n`
        })
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    content: `\`\`\`txt\n${message}\`\`\``
                }
              })
              return
    }
}