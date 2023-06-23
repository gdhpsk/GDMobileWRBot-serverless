module.exports = {
    data: {
      "name": "ping",
      "type": 1,
      "description": "Pinger",
  },
    async execute(interaction, rest, Routes) {
        return {
          body: {
            type: 4,
            data: {
              content: "Hello..."
            }
          }
        }
      }
    }