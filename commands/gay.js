module.exports = {
    data: {
      "name": "gay",
      "type": 1,
      "description": "Checks how gay you are",
      options: [
        {
            type: 3,
            name: "person",
            description: "What person do you want to input?"
        }
      ]
  },
  async execute(interaction, rest, Routes) {
    var big = Math.floor(Math.random() * 101);
    let whatever = interaction?.data?.options?.find(e => e.name == "person")?.value
    function lmfao() {
        if(!whatever) {
            return "you are "
        } else {
            return whatever + " is "
        }
    }
    const newEmbed = {
      title: "Gay meter",
      color: 0x430895,
      description: lmfao() + big + "% gay"
    }
    await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
      body: {
        type: 4,
        data: {
          embeds: [newEmbed]
        }
      }
    })
}
    }