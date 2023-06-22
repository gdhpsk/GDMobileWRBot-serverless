module.exports = {
    data: {
      "name": "submit",
      "type": 1,
      "description": "Submit a record using this command!",
      options: [
        {
            type: 11,
            name: "attachment",
            description: "What attachment would you like to add?"
        },
        {
            type: 3,
            name: "link",
            description: "What is the video Screenshot / Link of the WR?"
        },
        {
            type: 3,
            name: "comments",
            description: "What are your comments?"
        }
      ]
  },
  cooldown: require("../cooldowns.json").submit,
    async  execute(interaction, rest, Routes) {
        var users = ['361040834105311234', '416722306732130327', '703364595321929730']
        function getOne(name) {
            return interaction?.data?.options?.find(e => e.name == name)?.value
        }
        let comments = getOne("comments")
        var link = getOne("link") ?? getOne("attachment")
        function isAbsoluteUrl(string) {
            let url;
            
            try {
              url = new URL(string);
            } catch (_) {
              return false;  
            }
          
            return url.protocol === "http:" || url.protocol === "https:";
          }
       if(!link) {
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
            body: {
              type: 4,
              data: {
                content: "What link do you wanna send?"
              }
            }
          })
        return 
       }
       if(getOne("attachment")) {
        link = interaction.data.resolved.attachments[getOne("attachment")].url
   }
   if(!isAbsoluteUrl(link)) {
    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
        body: {
          type: 4,
          data: {
            content: "Please input a valid link!"
          }
        }
      })
      return
   }
     let lol = () => {
        return `${link} ${comments ? comments : ""}`
    }
        if(link.toString().length + (comments ?? "").toString().length > 2048) {
            await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                body: {
                  type: 4,
                  data: {
                    content: "Too long of a message."
                  }
                }
              })
        } else {
            rest.post(Routes.channelMessages("815155938159099945"), {
                body: 
                    {
                        content: `${lol()}`, 
                        allowed_mentions: {
                            parse: []
                        }
                    }
            })
            rest.post(Routes.channelMessages(process.env.logs_channel), {
                body: {content: `<@${interaction.member.user.id}> (${interaction.member.user.username}#${interaction.member.user.discriminator}) sent a new mobile world record with this link: ${link}`, allowed_mentions: {parse: []}}
            })
            await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                body: {
                  type: 4,
                  data: {
                    content: "Success!"
                  }
                }
              })
            return "success"
        }
}
}