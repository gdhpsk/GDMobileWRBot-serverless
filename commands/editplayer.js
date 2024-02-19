let leaderboardSchema = require("../schemas/leaderboard")

module.exports = {
    data: {
        name: "editplayer",
        description: "This is the editplayer command.",
        type: 1,
        dm_permission: false,
        default_member_permissions: 8,
        options: [
            {
                type: 3,
                name: "player",
                description: "The player's name",
                required: true
            },
            {
                type: 3,
                name: "name",
                description: "The edited name",
                required: false
            },
            {
                type: 3,
                name: "nationality",
                description: "The edited nationality",
                required: false
            },
            {
                type: 4,
                name: "minus",
                description: "The edited minus points",
                required: false
            },
            {
                type: 3,
                name: "discord_tag",
                description: "The edited discord tag",
                required: false
            },
            {
                type: 3,
                name: "discord_server",
                description: "The edited discord server",
                required: false
            },
            {
                type: 3,
                name: "youtube",
                description: "The edited youtube acc",
                required: false
            },
            {
                type: 3,
                name: "twitch",
                description: "The edited twitch acc",
                required: false
            },
            {
                type: 3,
                name: "twitter",
                description: "The edited twitter acc",
                required: false
            },
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
        let original = await leaderboardSchema.findOne({$expr: {$eq: [{$toLower: "$name"}, getOption("player").toLowerCase()]}})
        let obj = {
            original,
            changes: {
                name: getOption("name"),
                nationality: getOption("nationality"),
                minus: getOption("minus"),
                socials: [
                    {
                        discord: [getOption("discord_tag") == "null" ? undefined : getOption("discord_tag") || original.socials?.[0]?.discord?.[0], getOption("discord_server") == "null" ? undefined : getOption("discord_server") || original.socials?.[0]?.discord?.[1]],
                        youtube: getOption("youtube") == "null" ? undefined : getOption("youtube") || original.socials?.[0]?.youtube,
                        twitter: getOption("twitter") == "null" ? undefined : getOption("twitter") || original.socials?.[0]?.twitter,
                        twitch: getOption("twitch") == "null" ? undefined : getOption("twitch") || original.socials?.[0]?.twitch
                    }
                ]
            }
        }
        try {
            let req = await fetch("https://gdmobilewrlist.com/api/leaderboard/edit", {
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