module.exports = {
    data: {
      type: 1,
      name: "ping",
      description: "This is the ping command."
    },
    async execute(interaction, rest, Routes) {
      await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
        body: {
          content: "Hello...",
        }
      })
      return {
        type: 1
      }
      }
    }