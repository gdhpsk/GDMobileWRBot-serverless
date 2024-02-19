let levelsSchema = require("../schemas/levels")

module.exports = {
    data: {
        name: "addrecord",
        description: "This is the addrecord command.",
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
                name: "name",
                description: "The record holder's name",
                required: true
            },
            {
                type: 4,
                name: "percent1",
                description: "The main %",
                required: true
            },
            {
                type: 4,
                name: "percent2",
                description: "The screenshot / clip %",
                required: false
            },
            {
                type: 5,
                name: "listpercent",
                description: "is the record list %?",
                required: false
            },
            {
                type: 5,
                name: "deleted",
                description: "has the record since been deleted?",
                required: false
            },
            {
                type: 5,
                name: "verification",
                description: "is the record a verification?",
                required: false
            },
            {
                type: 5,
                name: "screenshot",
                description: "is the record a screenshot?",
                required: true
            },
            {
                type: 3,
                name: "link",
                description: "The edited youtube link",
                required: true
            },
            {
                type: 4,
                name: "hertz",
                description: "The edited hertz",
                required: true
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
            let level = await await levelsSchema.findById(getOption("level"))
            if(!level) throw new Error()
        } catch(_) {
    console.log(_)
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                    content: "Could not find the specified recordID ID!"
                }
              })
              return
        }
        let original = await levelsSchema.findById(getOption("level")).lean()
        let rec = {

        }
        for(let item of interaction.data?.options) {
            if(item.name == "record") continue;
            if(item.name == "percent1") {
                rec.percent[0] = item.value.toString()
                continue
            }
            if(item.name == "percent2") {
                rec.percent[1] = item.value.toString()
                continue
            }
            rec[item.name] = item.value
        }
        let obj = {
            level: original,
            record: rec
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