let levelsSchema = require("../schemas/levels")

module.exports = {
    data: {
        name: "editrecord",
        description: "This is the editrecord command.",
        type: 1,
        dm_permission: false,
        default_member_permissions: 8,
        options: [
            {
                type: 3,
                name: "record",
                description: "The record's Object ID",
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
            let level = await levelsSchema.findOne({$expr: {$in: [getOption("record"), {$map: {input: "$list", in: {$toString: "$$this._id"}}}]}})
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
        let original = await levelsSchema.findOne({$expr: {$in: [getOption("record"), {$map: {input: "$list", in: {$toString: "$$this._id"}}}]}})
        let rec = original.find(e => e._id.toString() == getOption("record"))
        console.log(interaction.data?.options)
        // let obj = {
        //     original,
        //     changes: {
        //         list: [

        //         ]
        //     }
        // }
        // try {
        //     let req = await fetch("https://gdmobilewrlist.com/api/levels/edit", {
        //     method: "PATCH",
        //     headers: {
        //         'content-type': "application/json"
        //     },
        //     body: JSON.stringify({
        //         token: process.env.API_TOKEN,
        //         ...obj
        //     })
        // })
        // if(req.ok) throw new Error()
        // let err = await req.json()
        // await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
        //     body: {
        //         content: err.message
        //     }
        //   })
        //   return
        // } catch(_) {
        //     await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
        //         body: {
        //             content: "Success!"
        //         }
        //       })
        //       return
        // }
    }
}