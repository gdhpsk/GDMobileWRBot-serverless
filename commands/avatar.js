
module.exports = {
    data: {
      "name": "avatar",
      "type": 1,
      "description": "Shows a users avatar",
      options: [
        {
            "type": 6,
            name: "user",
            description: "What user shall I display?",
            required: false
        }
      ]
  },
    async execute(interaction, rest, Routes) {
        async function important(user) {
            let embed = {
                title: `${user.username}'s avatar:`,
                image: {
                    url: `https://cdn.discordapp.com${!user.avatar ? "/embed" : ""}/avatars/${user.avatar ? `${user.id}/${user.avatar}${user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(user.discriminator) % 5}.png`}?size=1024`
                }
            }
            await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                body: {
                  type: 4,
                  data: {
                    embeds: [embed]
                  }
                }
              })
        }
        if(interaction?.data?.options?.find(e => e.name == "user")?.value) {
            let user = await rest.get(Routes.user(interaction.data.options.find(e => e.name == "user").value))
          await important(user)
        } else {
           await  important(interaction.user)
        }
    }
}