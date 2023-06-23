module.exports = {
    data: {
      "name": "ping",
      "type": 1,
      "description": "Pinger",
  },
    async execute(interaction, rest, Routes) {
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
          body: {
            type: 4,
            data: {
              content: "Hello..."
            }
          }
        })
      }
    }