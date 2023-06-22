module.exports = {
    data: {
      type: 1,
      name: "ping",
      description: "This is the ping command."
    },
    async execute(interaction, rest, Routes) {
      if(interaction.data.component_type == 2) {
        return {
          type: 7,
          data: {
            content: "Hello"
          }
        }
      }
      await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
        body: {
          type: 5
        }
      })
      await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
        body: {
          content: "Pong!",
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  label: "test",
                  style: 1,
                  custom_id: "test"
                }
              ]
            }
          ]
        }
      })
      return {
        type: 1
      }
      }
    }