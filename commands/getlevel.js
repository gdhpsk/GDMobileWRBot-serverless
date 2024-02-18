let levelsSchema = require("../schemas/levels")

module.exports = {
    data: {
        name: "getlevel",
        description: "This is the getlevel command.",
        type: 1,
        dm_permission: false,
        default_member_permissions: 8,
        options: [
            {
                type: 3,
                name: "level",
                description: "The level's Object ID",
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
        let message = ""
        Object.entries(original).filter(e => e[0] != "list").forEach(e => {
            message += `${e[0]}: ${e[1]}\n`
        })
        message += "Records: \n"
        Object.entries(original.list).filter(e => e[0] != "list").forEach(e => {
            message += `\r${e[0]}: ${e[1]}\n`
        })
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    content: message
                }
              })
              return
    }
}